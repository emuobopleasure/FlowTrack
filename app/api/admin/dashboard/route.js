import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import Analytics from '@/models/Analytics'

/**
 * GET /api/admin/dashboard
 *
 * Returns all data needed to populate the admin dashboard:
 * - Summary stats (total bookings, revenue, completion rate)
 * - All confirmed bookings for the bookings table
 * - Drop-off analytics data for the chart
 *
 * Protected: only accessible to authenticated admin.
 * If the request has no valid session, return 401 immediately.
 *
 * Why fetch everything in one route?
 * The dashboard needs all three datasets at once.
 * One request is faster and simpler than three separate calls.
 */
export const GET = async () => {
  try {
    // Verify the admin session before touching the database
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorised' },
        { status: 401 }
      )
    }

    await connectDB()

    // Run all three database queries in parallel
    // Promise.all fires them simultaneously instead of one after another
    // This is significantly faster than three sequential await calls
    const [bookings, sessionStats, analyticsData] = await Promise.all([

      // All confirmed paid bookings — newest first
      Booking.find({ paymentStatus: 'paid' })
        .sort({ createdAt: -1 })
        .select('-otp -otpExpiresAt')
        // Exclude OTP fields from the list view — sensitive data
        // only needed on individual booking detail page
        .lean(),
      // .lean() returns plain JavaScript objects instead of
      // Mongoose documents — faster and uses less memory

      // Session counts for summary stats
      Session.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      // Analytics drop-off data — same pipeline as /api/analytics GET
      Analytics.aggregate([
        {
          $group: {
            _id: { step: '$step', event: '$event' },
            count: { $sum: 1 },
            avgTimeSpent: { $avg: '$timeSpent' },
          },
        },
        {
          $group: {
            _id: '$_id.step',
            events: {
              $push: {
                event: '$_id.event',
                count: '$count',
                avgTimeSpent: '$avgTimeSpent',
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    // Build summary stats from session aggregation
    const statsMap = sessionStats.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {})

    const totalCompleted = statsMap.completed ?? 0
    const totalAbandoned = statsMap.abandoned ?? 0
    const totalActive = statsMap.active ?? 0
    const totalSessions = totalCompleted + totalAbandoned + totalActive

    const completionRate =
      totalSessions > 0
        ? Math.round((totalCompleted / totalSessions) * 100)
        : 0

    // Calculate total revenue from confirmed bookings
    // Paystack stores amounts in kobo — already converted in payment verify
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.amount ?? 0)
    }, 0)

    // Transform analytics into dashboard-ready format
    const dropOffData = analyticsData.map((stepGroup) => {
      const events = stepGroup.events

      const getCount = (eventName) =>
        events.find((e) => e.event === eventName)?.count ?? 0

      const totalEntered = getCount('entered')
      const totalAbandoned = getCount('abandoned')

      const dropOffRate =
        totalEntered > 0
          ? Math.round((totalAbandoned / totalEntered) * 100)
          : 0

      return {
        step: stepGroup._id,
        totalEntered,
        totalExited: getCount('exited'),
        totalAbandoned,
        totalBacked: getCount('backed'),
        totalCompleted: getCount('completed'),
        dropOffRate,
        avgTimeSpent: Math.round(
          events.find((e) => e.event === 'entered')?.avgTimeSpent ?? 0
        ),
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: bookings.length,
        totalRevenue,
        completionRate,
        totalAbandoned,
        totalActive,
      },
      bookings,
      dropOffData,
    })

  } catch (error) {
    console.error('GET /api/admin/dashboard error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
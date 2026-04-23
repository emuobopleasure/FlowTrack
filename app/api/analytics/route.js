import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Analytics from '@/models/Analytics'

/**
 * POST /api/analytics
 *
 * Logs a single step event during the booking flow.
 * Called by useAnalytics.js hook on every step interaction.
 *
 * Called when:
 * - Customer enters a step (event: "entered")
 * - Customer advances to next step (event: "exited")
 * - Customer goes back (event: "backed")
 * - Customer abandons the flow (event: "abandoned")
 * - Customer completes payment (event: "completed")
 */
export const POST = async (request) => {
  try {
    await connectDB()

    const { anonymousSessionId, email, step, event, timeSpent } =
      await request.json()

    if (!anonymousSessionId || !step || !event) {
      return NextResponse.json(
        { success: false, error: 'anonymousSessionId, step, and event are required' },
        { status: 400 }
      )
    }

    const analyticsEvent = await Analytics.create({
      anonymousSessionId,
      email: email ? email.toLowerCase().trim() : null,
      step,
      event,
      timeSpent: timeSpent ?? 0,
    })

    return NextResponse.json(
      { success: true, analyticsEvent },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/analytics error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


/**
 * GET /api/analytics
 *
 * Aggregates all analytics events into drop-off data
 * for the admin dashboard.
 *
 * Returns for each step:
 * - totalEntered   → how many customers reached this step
 * - totalExited    → how many customers advanced past this step
 * - totalAbandoned → how many customers left on this step
 * - totalBacked    → how many customers went back from this step
 * - dropOffRate    → percentage who abandoned on this step
 * - avgTimeSpent   → average seconds spent on this step
 *
 * MongoDB aggregation pipeline is used here instead of fetching
 * all documents and processing in JavaScript.
 * Aggregation runs inside MongoDB — much faster at scale.
 */
export const GET = async () => {
  try {
    await connectDB()

    const pipeline = [
      // Stage 1: Group all events by step number
      {
        $group: {
          _id: { step: '$step', event: '$event' },
          count: { $sum: 1 },
          avgTimeSpent: { $avg: '$timeSpent' },
        },
      },
      // Stage 2: Reshape into a cleaner structure per step
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
      // Stage 3: Sort steps in ascending order (1 → 6)
      {
        $sort: { _id: 1 },
      },
    ]

    const rawData = await Analytics.aggregate(pipeline)

    // Transform the aggregated data into a clean format
    // the dashboard components can consume directly
    const stepData = rawData.map((stepGroup) => {
      const events = stepGroup.events

      const getCount = (eventName) =>
        events.find((e) => e.event === eventName)?.count ?? 0

      const getAvgTime = (eventName) =>
        events.find((e) => e.event === eventName)?.avgTimeSpent ?? 0

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
        avgTimeSpent: Math.round(getAvgTime('entered')),
      }
    })

    return NextResponse.json({ success: true, data: stepData })

  } catch (error) {
    console.error('GET /api/analytics error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'

/**
 * GET /api/admin/bookings/[id]
 *
 * Returns the full detail of a single booking for the
 * individual booking detail page on the admin dashboard.
 *
 * Unlike the dashboard route, this includes the OTP fields
 * so the admin can see verification status.
 *
 * Protected: admin session required.
 */
export const GET = async (request, { params }) => {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorised' },
        { status: 401 }
      )
    }

    await connectDB()

    const booking = await Booking.findById(params.id).lean()

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking })

  } catch (error) {
    console.error('GET /api/admin/bookings/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


/**
 * PATCH /api/admin/bookings/[id]
 *
 * Allows the admin to update a booking's status.
 * Useful for marking a booking as fulfilled or flagging issues.
 *
 * Only specific fields can be updated — not the entire document.
 * This prevents accidental overwrites of customer data.
 */
export const PATCH = async (request, { params }) => {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorised' },
        { status: 401 }
      )
    }

    await connectDB()

    const { paymentStatus } = await request.json()

    // Whitelist of fields the admin is allowed to update
    const allowedUpdates = {}
    if (paymentStatus) allowedUpdates.paymentStatus = paymentStatus

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      allowedUpdates,
      { new: true }
    ).lean()

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking })

  } catch (error) {
    console.error('PATCH /api/admin/bookings/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
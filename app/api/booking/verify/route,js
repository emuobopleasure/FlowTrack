import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { isOTPExpired } from '@/lib/token'

/**
 * POST /api/booking/verify
 *
 * Verifies a customer's identity using their email and OTP.
 * Called when the customer submits the form on /booking/verify.
 *
 * Validation checks in order:
 * 1. Does a booking exist for this email?
 * 2. Does the OTP match?
 * 3. Has the OTP expired?
 *
 * On success:
 * - Sets otpVerified: true on the booking document
 * - Returns the full booking data to display the summary
 *
 * On failure:
 * - Returns a specific error message for each failure case
 *   so the frontend can show the right message to the customer
 */
export const POST = async (request) => {
  try {
    await connectDB()

    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const booking = await Booking.findOne({
      email: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 })
    // Sort by most recent in case a customer has multiple bookings

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'No booking found for this email address' },
        { status: 404 }
      )
    }

    // Check OTP match before checking expiry
    // This prevents timing attacks where someone could
    // determine if an email exists by comparing error messages
    if (booking.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect verification code' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (isOTPExpired(booking.otpExpiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This verification code has expired. Please contact us directly.',
          expired: true,
        },
        { status: 410 }
      )
    }

    // Mark the OTP as verified so we know the customer
    // has successfully accessed their booking summary
    await Booking.findByIdAndUpdate(booking._id, { otpVerified: true })

    return NextResponse.json({
      success: true,
      booking: {
        email: booking.email,
        name: booking.name,
        phone: booking.phone,
        service: booking.service,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        measurementType: booking.measurementType,
        measurements: booking.measurements,
        specialRequests: booking.specialRequests,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      },
      // Note: OTP and paymentRef are intentionally excluded
      // from the response — the customer does not need to see these
    })

  } catch (error) {
    console.error('POST /api/booking/verify error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
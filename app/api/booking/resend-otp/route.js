import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { generateOTP, generateOTPExpiry, sendConfirmationEmail } from '@/lib/token'

/**
 * POST /api/booking/resend-otp
 *
 * Generates a fresh OTP and sends a new confirmation email.
 * Called when the customer clicks "Resend code" on /booking/verify.
 *
 * Rate limiting: we only allow a resend if the last OTP was
 * generated more than 60 seconds ago — prevents abuse.
 */
export const POST = async (request) => {
  try {
    await connectDB()

    const { email } = await request.json()

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      )
    }

    const booking = await Booking.findOne({
      email: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'No booking found for this email address' },
        { status: 404 }
      )
    }

    // Rate limit — prevent resending more than once per 60 seconds
    if (booking.otpExpiresAt) {
      const otpGeneratedAt = new Date(booking.otpExpiresAt).getTime() - 24 * 60 * 60 * 1000
      const secondsSinceGenerated = (Date.now() - otpGeneratedAt) / 1000
      if (secondsSinceGenerated < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceGenerated)
        return NextResponse.json(
          {
            success: false,
            error:   `Please wait ${waitSeconds} seconds before requesting a new code.`,
            retryAfter: waitSeconds,
          },
          { status: 429 }
        )
      }
    }

    // Generate fresh OTP
    const otp          = generateOTP()
    const otpExpiresAt = generateOTPExpiry()

    await Booking.findByIdAndUpdate(booking._id, {
      otp,
      otpExpiresAt,
      otpVerified: false,
    })

    // Send new confirmation email
    await sendConfirmationEmail({
      email:          booking.email,
      name:           booking.name,
      otp,
      bookingDetails: {
        service:            booking.service,
        outfitStyle:        booking.outfitStyle,
        appointmentDate:    booking.appointmentDate,
        appointmentTime:    booking.appointmentTime,
        measurementType:    booking.measurementType,
        alterationType:     booking.alterationType,
        consultationFormat: booking.consultationFormat,
      },
    })

    return NextResponse.json(
      { success: true, message: 'A new verification code has been sent to your email.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('POST /api/booking/resend-otp error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { isOTPExpired } from '@/lib/token'

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

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'No booking found for this email address' },
        { status: 404 }
      )
    }

    if (booking.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect verification code' },
        { status: 400 }
      )
    }

    if (isOTPExpired(booking.otpExpiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error:   'This verification code has expired. Please contact us directly.',
          expired: true,
        },
        { status: 410 }
      )
    }

    await Booking.findByIdAndUpdate(booking._id, { otpVerified: true })

    return NextResponse.json({
      success: true,
      booking: {
        // ── Identity ────────────────────────────────────────
        email:         booking.email,
        name:          booking.name,
        phone:         booking.phone,

        // ── Service ─────────────────────────────────────────
        service:       booking.service,

        // ── Custom outfit fields ─────────────────────────────
        outfitStyle:     booking.outfitStyle     || '',
        measurementType: booking.measurementType || null,
        measurements:    booking.measurements    || {},

        // ── Alteration fields ────────────────────────────────
        alterationType:         booking.alterationType         || '',
        alterationDetails:      booking.alterationDetails      || '',
        alterationMeasurements: booking.alterationMeasurements || {},

        // ── Consultation fields ──────────────────────────────
        consultationFormat: booking.consultationFormat || '',
        consultationTopics: booking.consultationTopics || '',

        // ── Appointment ──────────────────────────────────────
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,

        // ── Other ────────────────────────────────────────────
        specialRequests: booking.specialRequests || '',
        paymentStatus:   booking.paymentStatus,
        amount:          booking.amount || 0,
        createdAt:       booking.createdAt,
      },
    })

  } catch (error) {
    console.error('POST /api/booking/verify error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
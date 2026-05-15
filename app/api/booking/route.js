import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import { generateOTP, generateOTPExpiry, sendConfirmationEmail } from '@/lib/token'

const PRICES = {
  custom_outfit: 45000,
  alteration:    8000,
  consultation:  15000,
}

export const POST = async (request) => {
  try {
    await connectDB()

    const body = await request.json()

    const {
      email,
      name,
      phone,
      service,
      outfitStyle,
      appointmentDate,
      appointmentTime,
      measurementType,
      measurements,
      alterationType,
      alterationDetails,
      alterationMeasurements,
      consultationFormat,
      consultationTopics,
      specialRequests,
      paymentRef,
      anonymousSessionId,
    } = body

    // Validate required fields
    if (!email || !name || !phone || !service || !paymentRef) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields' },
        { status: 400 }
      )
    }

    if (!appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: 'Appointment date and time are required' },
        { status: 400 }
      )
    }

    // Prevent duplicate bookings
    const existingBooking = await Booking.findOne({ paymentRef })
    if (existingBooking) {
      return NextResponse.json(
        { success: true, booking: existingBooking },
        { status: 200 }
      )
    }

    const otp          = generateOTP()
    const otpExpiresAt = generateOTPExpiry()
    const amount       = PRICES[service] || 0

    // Build the booking document based on service type
    const bookingData = {
      email:          email.toLowerCase().trim(),
      name:           name.trim(),
      phone:          phone.trim(),
      service,
      appointmentDate,
      appointmentTime,
      specialRequests: specialRequests ?? '',
      paymentRef,
      paymentStatus:  'paid',
      amount,
      otp,
      otpExpiresAt,
      otpVerified:    false,
    }

    // Custom outfit specific fields
    if (service === 'custom_outfit') {
      bookingData.outfitStyle     = outfitStyle     ?? ''
      bookingData.measurementType = measurementType ?? null
      bookingData.measurements    = measurements    ?? {}
    }

    // Alteration specific fields
    if (service === 'alteration') {
      bookingData.alterationType          = alterationType          ?? ''
      bookingData.alterationDetails       = alterationDetails       ?? ''
      bookingData.alterationMeasurements  = alterationMeasurements  ?? {}
    }

    // Consultation specific fields
    if (service === 'consultation') {
      bookingData.consultationFormat = consultationFormat ?? ''
      bookingData.consultationTopics = consultationTopics ?? ''
    }

    const booking = await Booking.create(bookingData)

    // Mark session as completed
    if (anonymousSessionId) {
      await Session.findOneAndUpdate(
        { anonymousSessionId },
        { status: 'completed' }
      ).catch(() => {})
    }

    // Send confirmation email — non-blocking
    try {
      await sendConfirmationEmail({
        email:          booking.email,
        name:           booking.name,
        otp,
        service:        booking.service,
        bookingDetails: {
          service:         booking.service,
          outfitStyle:     booking.outfitStyle,
          appointmentDate: booking.appointmentDate,
          appointmentTime: booking.appointmentTime,
          measurementType: booking.measurementType,
          alterationType:  booking.alterationType,
          consultationFormat: booking.consultationFormat,
        },
      })
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message)
    }

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/booking error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
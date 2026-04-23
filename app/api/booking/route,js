import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import { generateOTP, generateOTPExpiry, sendConfirmationEmail } from '@/lib/token'

/**
 * POST /api/booking
 *
 * Creates a confirmed booking after payment is verified.
 *
 * This route is only called after POST /api/payment/verify
 * returns verified: true. Never call this route directly
 * without verifying payment first.
 *
 * What happens here:
 * 1. Generate a 6-digit OTP and expiry timestamp
 * 2. Create the Booking document in MongoDB
 * 3. Update the Session status to "completed"
 * 4. Send the confirmation email with OTP via Resend
 * 5. Return the booking to the client
 */
export const POST = async (request) => {
  try {
    await connectDB()

    const {
      email,
      name,
      phone,
      service,
      appointmentDate,
      appointmentTime,
      measurementType,
      measurements,
      specialRequests,
      paymentRef,
      anonymousSessionId,
    } = await request.json()

    // Validate required fields before touching the database
    if (!email || !name || !phone || !service || !paymentRef) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields' },
        { status: 400 }
      )
    }

    // Check if a booking with this payment reference already exists
    // Prevents duplicate bookings if the request is sent twice
    const existingBooking = await Booking.findOne({ paymentRef })
    if (existingBooking) {
      return NextResponse.json(
        { success: true, booking: existingBooking },
        { status: 200 }
      )
    }

    // Generate OTP for booking verification
    const otp = generateOTP()
    const otpExpiresAt = generateOTPExpiry()

    // Create the confirmed booking document
    const booking = await Booking.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone.trim(),
      service,
      appointmentDate,
      appointmentTime,
      measurementType,
      measurements: measurements ?? {},
      specialRequests: specialRequests ?? '',
      paymentRef,
      paymentStatus: 'paid',
      otp,
      otpExpiresAt,
      otpVerified: false,
    })

    // Mark the session as completed
    // This is what powers the "completed" metric on the dashboard
    await Session.findOneAndUpdate(
      { anonymousSessionId },
      { status: 'completed' }
    )

    // Send confirmation email with OTP and booking summary
    // This is non-blocking — if the email fails, the booking
    // is still confirmed. The customer can contact the designer directly.
    try {
      await sendConfirmationEmail({
        email: booking.email,
        name: booking.name,
        otp,
        bookingDetails: {
          service: booking.service,
          appointmentDate: booking.appointmentDate,
          appointmentTime: booking.appointmentTime,
          measurementType: booking.measurementType,
        },
      })
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError)
      // Do not return an error — booking is confirmed regardless
    }

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/booking error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
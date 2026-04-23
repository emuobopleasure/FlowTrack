import { NextResponse } from 'next/server'
import { sendConfirmationEmail } from '@/lib/token'

/**
 * POST /api/email
 *
 * Standalone email sending route.
 * Used as a fallback if the email fails inside POST /api/booking.
 * The admin can also trigger a resend from the dashboard if needed.
 */
export const POST = async (request) => {
  try {
    const { email, name, otp, bookingDetails } = await request.json()

    if (!email || !name || !otp || !bookingDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await sendConfirmationEmail({ email, name, otp, bookingDetails })

    return NextResponse.json({ success: true, message: 'Email sent' })

  } catch (error) {
    console.error('POST /api/email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'

/**
 * POST /api/session/resume
 *
 * Fetches a saved session by email so the customer
 * can continue their booking from where they left off.
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

    const session = await Session.findOne({
      email: email.toLowerCase().trim(),
      status: { $ne: 'completed' },
    }).sort({ updatedAt: -1 })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No saved booking found for this email address.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success:  true,
      session: {
        currentStep:        session.currentStep,
        formData:           session.formData,
        anonymousSessionId: session.anonymousSessionId,
      },
    })

  } catch (error) {
    console.error('POST /api/session/resume error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
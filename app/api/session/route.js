import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'

/**
 * POST /api/session
 *
 * Called once when the customer lands on the booking page.
 * Creates a new anonymous session document in MongoDB using
 * the anonymousSessionId generated in memory by useFormState.
 *
 * If a session with this anonymousSessionId already exists
 * (e.g. page refresh), we return the existing one instead
 * of creating a duplicate.
 */
export const POST = async (request) => {
  try {
    await connectDB()

    const { anonymousSessionId } = await request.json()

    if (!anonymousSessionId) {
      return NextResponse.json(
        { success: false, error: 'anonymousSessionId is required' },
        { status: 400 }
      )
    }

    // upsert: true → create if not found, update if found
    // This handles page refreshes gracefully without duplicate sessions
    const session = await Session.findOneAndUpdate(
      { anonymousSessionId },
      { anonymousSessionId },
      { upsert: true, new: true }
    )

    return NextResponse.json(
      { success: true, session },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/session error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


/**
 * PATCH /api/session
 *
 * Called on every step advance to save the customer's latest progress.
 *
 * Steps 1–3: saves against anonymousSessionId only (email is null)
 * Step 4+:   saves email alongside anonymousSessionId — email becomes
 *            the persistent identifier from this point forward
 *
 * The formData object is replaced entirely on each save — it always
 * contains the full current state of the form, not just the new fields.
 */
export const PATCH = async (request) => {
  try {
    await connectDB()

    const { anonymousSessionId, email, currentStep, formData } =
      await request.json()

    if (!anonymousSessionId) {
      return NextResponse.json(
        { success: false, error: 'anonymousSessionId is required' },
        { status: 400 }
      )
    }

    // Build the update object dynamically
    // Only include email in the update if it has been provided
    const updateData = {
      currentStep,
      formData,
      ...(email && { email: email.toLowerCase().trim() }),
    }

    const session = await Session.findOneAndUpdate(
      { anonymousSessionId },
      updateData,
      { new: true }
    )

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, session })

  } catch (error) {
    console.error('PATCH /api/session error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


/**
 * GET /api/session
 *
 * Called when a returning customer enters their email at step 4
 * on a different device or browser.
 *
 * Finds their existing session by email and returns their saved
 * progress so the form can be restored from where they left off.
 *
 * Only returns sessions with status "active" — we do not restore
 * completed or abandoned sessions.
 */
export const GET = async (request) => {
  try {
    await connectDB()

    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const session = await Session.findOne({
      email: email.toLowerCase().trim(),
      status: 'active',
    }).sort({ updatedAt: -1 })
    // Sort by most recently updated in case there are
    // multiple active sessions for the same email

    if (!session) {
      return NextResponse.json(
        { success: false, session: null },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, session })

  } catch (error) {
    console.error('GET /api/session error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
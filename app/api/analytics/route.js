import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Analytics from "@/models/Analytics"

/**
 * POST /api/analytics
 *
 * Receives step analytics events from the booking flow.
 * Called via navigator.sendBeacon — must handle plain text body.
 *
 * Events: entered | abandoned | completed
 */
export const POST = async (request) => {
  try {
    await connectDB()

    // sendBeacon sends as text/plain — parse it manually
    const contentType = request.headers.get("content-type") || ""
    let body

    if (contentType.includes("application/json")) {
      body = await request.json()
    } else {
      // sendBeacon sends as text/plain
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { step, event, timeSpent, anonymousSessionId, email } = body

    if (!step || !event || !anonymousSessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    await Analytics.create({
      step,
      event,
      timeSpent:          timeSpent          ?? 0,
      anonymousSessionId,
      email:              email?.toLowerCase() ?? null,
    })

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (error) {
    console.error("POST /api/analytics error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics
 *
 * Returns aggregated drop-off data for the admin dashboard.
 */
export const GET = async () => {
  try {
    await connectDB()

    const events = await Analytics.find({}).lean()

    return NextResponse.json({ success: true, events }, { status: 200 })

  } catch (error) {
    console.error("GET /api/analytics error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
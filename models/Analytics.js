import mongoose, { Schema } from 'mongoose'

/**
 * Analytics Model
 *
 * One document per event — not per session.
 * A single customer journey through all 6 steps generates
 * multiple analytics documents (one per step event).
 *
 * Event types:
 * - "entered"   → customer arrived at this step
 * - "exited"    → customer moved forward to the next step
 * - "backed"    → customer went back to the previous step
 * - "abandoned" → customer left the flow without completing it
 * - "completed" → customer completed payment successfully
 *
 * Identifier logic:
 * - Steps 1–3: only anonymousSessionId is available (email is null)
 * - Steps 4–6: email is available and stored alongside the anonymousSessionId
 *
 * This allows the dashboard to show drop-off data across the entire
 * flow including the anonymous steps.
 */

const analyticsSchema = new Schema(
  {
    anonymousSessionId: {
      type: String,
      required: true,
      // Always present — generated at the start of every booking flow.
    },
    email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      // Null for steps 1–3. Populated from step 4 onward.
      // Allows linking anonymous early-step events to a known customer.
    },
    step: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    event: {
      type: String,
      enum: {
        values: ['entered', 'exited', 'backed', 'abandoned', 'completed'],
        message: '{VALUE} is not a valid analytics event',
      },
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
      // Seconds the customer spent on this step before the event fired.
      // Calculated in useAnalytics.js by comparing mount time to event time.
    },
  },
  {
    timestamps: true,
    // createdAt serves as the event timestamp.
    // Use this when aggregating events over time on the dashboard.
  }
)

// Index for faster dashboard aggregation queries
// When the dashboard runs: find all events grouped by step,
// MongoDB will use this index instead of scanning every document.
analyticsSchema.index({ step: 1, event: 1 })
analyticsSchema.index({ anonymousSessionId: 1 })
analyticsSchema.index({ email: 1 })

export default mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema)
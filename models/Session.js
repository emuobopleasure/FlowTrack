import mongoose, { Schema } from 'mongoose'

/**
 * Session Model
 *
 * Tracks every customer who starts the booking flow.
 *
 * Steps 1–3 (anonymous):
 * Progress is saved against the anonymousSessionId only.
 * Email is null at this stage.
 *
 * Step 4 onward (persistent):
 * Email is captured and becomes the primary identifier.
 * The anonymousSessionId stays on the document so we can
 * link the anonymous analytics events from steps 1–3
 * back to the customer who eventually completed the flow.
 *
 * status:
 * - "active"    → customer is still in the flow
 * - "abandoned" → customer left without completing payment
 * - "completed" → payment was successful, booking confirmed
 */

const sessionSchema = new Schema(
  {
    anonymousSessionId: {
      type: String,
      required: true,
      unique: true,
      // Generated in memory by useFormState when the hook mounts.
      // Used to track analytics events before email is known.
    },
    email: {
      type: String,
      default: null,
      index: true,
      // Null until step 4. Indexed for fast lookup when restoring
      // progress for a returning customer on a different device.
      lowercase: true,
      trim: true,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    formData: {
      type: Object,
      default: {},
      // Stores the entire form state progressively as the customer advances.
      // Shape matches initialFormData in useFormState.js
    },
    status: {
      type: String,
      enum: ['active', 'abandoned', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    // Automatically adds:
    // createdAt — when the session was first created
    // updatedAt — last time the session was modified
  }
)

// IMPORTANT: This pattern prevents Mongoose from throwing
// "Cannot overwrite model once compiled" during hot reloads in development.
// Always use this export pattern for every model in Next.js.
export default mongoose.models.Session ||
  mongoose.model('Session', sessionSchema)
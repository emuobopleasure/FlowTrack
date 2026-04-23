import mongoose, { Schema } from 'mongoose'

/**
 * Booking Model
 *
 * A booking document is only created after payment is successfully
 * verified server-side via Paystack. It is never created before that.
 *
 * OTP fields:
 * - otp          → 6-digit code sent to the customer's email
 * - otpExpiresAt → timestamp 24 hours after generation
 * - otpVerified  → true once the customer verifies on /booking/verify
 *
 * The OTP is what allows the customer to access their booking summary
 * from any device at any time within 24 hours of confirmation.
 */

const measurementSchema = new Schema(
  {
    chest: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    length: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
  // _id: false — this is a nested object, not its own collection.
  // We do not need a separate _id on the measurements subdocument.
)

const bookingSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    service: {
      type: String,
      enum: {
        values: ['custom_outfit', 'alteration', 'consultation'],
        message: '{VALUE} is not a valid service type',
      },
      required: [true, 'Service is required'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    measurementType: {
      type: String,
      enum: {
        values: ['physical', 'self'],
        message: '{VALUE} is not a valid measurement type',
      },
      required: [true, 'Measurement type is required'],
    },
    measurements: {
      type: measurementSchema,
      default: () => ({}),
      // Only populated when measurementType is "self".
      // When measurementType is "physical", this remains empty.
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },
    paymentRef: {
      type: String,
      required: [true, 'Payment reference is required'],
      unique: true,
      // Paystack payment reference — unique per transaction.
      // Stored so we can reference it in case of a payment dispute.
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    otp: {
      type: String,
      default: null,
      // 6-digit code as a string — stored as plain text for now.
      // In a production app beyond this portfolio, hash with bcrypt.
    },
    otpExpiresAt: {
      type: Date,
      default: null,
      // Set to Date.now() + 24 hours when OTP is generated.
      // After this timestamp, the OTP is invalid.
    },
    otpVerified: {
      type: Boolean,
      default: false,
      // Flipped to true once the customer successfully enters
      // their email + OTP on /booking/verify.
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema)
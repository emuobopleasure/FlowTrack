import mongoose, { Schema } from 'mongoose'

const measurementSchema = new Schema(
  {
    chest:    { type: String, default: '' },
    waist:    { type: String, default: '' },
    hips:     { type: String, default: '' },
    shoulder: { type: String, default: '' },
    height:   { type: String, default: '' },
    sleeve:   { type: String, default: '' },
    notes:    { type: String, default: '' },
  },
  { _id: false }
)

const bookingSchema = new Schema(
  {
    email: {
      type:     String,
      required: [true, 'Email is required'],
      index:    true,
      lowercase: true,
      trim:     true,
    },
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    phone: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
    },

    // ── Service ──────────────────────────────────────────────
    service: {
      type: String,
      enum: {
        values:  ['custom_outfit', 'alteration', 'consultation'],
        message: '{VALUE} is not a valid service type',
      },
      required: [true, 'Service is required'],
    },

    // ── Outfit style — only for custom_outfit ─────────────────
    outfitStyle: {
      type:    String,
      default: '',
      // One of: agbada, senator, kaftan, ankara_shirt, babariga, aso_oke
      // Empty for alteration and consultation bookings
    },

    // ── Appointment ───────────────────────────────────────────
    appointmentDate: {
      type:     String,
      required: [true, 'Appointment date is required'],
      // Stored as string (YYYY-MM-DD) to avoid timezone conversion issues
    },
    appointmentTime: {
      type:     String,
      required: [true, 'Appointment time is required'],
    },

    // ── Measurement — custom_outfit only ──────────────────────
    measurementType: {
      type: String,
      enum: {
        values:  ['physical', 'self'],
        message: '{VALUE} is not a valid measurement type',
      },
      // Not required at schema level — alteration and consultation
      // do not use this field. Validated at the route level instead.
      default: null,
    },
    measurements: {
      type:    measurementSchema,
      default: () => ({}),
      // Only populated when measurementType is "self"
    },

    // ── Alteration — alteration only ──────────────────────────
    alterationType: {
      type:    String,
      default: '',
      // One of: resize, hemming, repair, restructure
    },
    alterationDetails: {
      type:    String,
      default: '',
      trim:    true,
      // Free-text description of what needs altering
    },
    alterationMeasurements: {
      type:    measurementSchema,
      default: () => ({}),
      // Customer's current measurements for alteration reference
    },

    // ── Consultation — consultation only ──────────────────────
    consultationFormat: {
      type:    String,
      default: '',
      // "in_person" or "online"
    },
    consultationTopics: {
      type:    String,
      default: '',
      trim:    true,
      // What the customer wants to discuss
    },

    // ── Common ────────────────────────────────────────────────
    specialRequests: {
      type:    String,
      default: '',
      trim:    true,
    },

    // ── Payment ───────────────────────────────────────────────
    paymentRef: {
      type:     String,
      required: [true, 'Payment reference is required'],
      unique:   true,
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    amount: {
      type:    Number,
      default: 0,
      // Stored in Naira — not kobo
    },

    // ── OTP ───────────────────────────────────────────────────
    otp: {
      type:    String,
      default: null,
    },
    otpExpiresAt: {
      type:    Date,
      default: null,
    },
    otpVerified: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema)
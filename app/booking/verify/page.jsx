"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SERVICE_LABELS = {
  custom_outfit: "Custom Outfit",
  alteration:    "Alteration",
  consultation:  "Styling Consultation",
}

const OUTFIT_LABELS = {
  agbada:       "Agbada",
  senator:      "Senator Suit",
  kaftan:       "Kaftan",
  ankara_shirt: "Ankara Shirt",
  babariga:     "Babariga",
  aso_oke:      "Aso-Oke Set",
}

const ALTERATION_LABELS = {
  resize:      "Resizing",
  hemming:     "Hemming",
  repair:      "Repair",
  restructure: "Restructure",
}

const CONSULTATION_FORMAT_LABELS = {
  in_person: "In-person session",
  online:    "Online session",
}

const formatDate = (dateStr) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
}

/**
 * Build confirmed booking summary rows dynamically.
 * Same logic as StepSeven — only show rows relevant to the service.
 */
const buildSummaryRows = (booking) => {
  const rows = []
  const { service } = booking

  rows.push({ label: "Service", value: SERVICE_LABELS[service] || service })

  if (service === "custom_outfit" && booking.outfitStyle) {
    rows.push({
      label: "Style",
      value: OUTFIT_LABELS[booking.outfitStyle] || booking.outfitStyle,
    })
  }

  if (service === "alteration") {
    if (booking.alterationType) {
      rows.push({
        label: "Alteration type",
        value: ALTERATION_LABELS[booking.alterationType] || booking.alterationType,
      })
    }
    if (booking.alterationDetails?.trim()) {
      rows.push({ label: "Alteration details", value: booking.alterationDetails })
    }
  }

  if (service === "consultation") {
    if (booking.consultationFormat) {
      rows.push({
        label: "Session format",
        value: CONSULTATION_FORMAT_LABELS[booking.consultationFormat] || booking.consultationFormat,
      })
    }
    if (booking.consultationTopics?.trim()) {
      rows.push({ label: "Topics", value: booking.consultationTopics })
    }
  }

  rows.push({ label: "Date", value: formatDate(booking.appointmentDate) })
  rows.push({ label: "Time", value: booking.appointmentTime || "—" })

  if (service === "custom_outfit" && booking.measurementType) {
    rows.push({
      label: "Measurement",
      value: booking.measurementType === "physical"
        ? "Come in for fitting"
        : "Self-submitted",
    })
  }

  rows.push({ label: "Name",  value: booking.name  || "—" })
  rows.push({ label: "Email", value: booking.email || "—" })
  rows.push({ label: "Phone", value: booking.phone || "—" })

  rows.push({
    label: "Payment",
    value: booking.paymentStatus === "paid" ? "Paid ✓" : "Pending",
    isPayment: true,
  })

  rows.push({ label: "Booked on", value: formatDate(booking.createdAt) })

  return rows
}

/**
 * Build measurements display — only for self-submitted or alteration
 */
const getMeasurements = (booking) => {
  if (booking.service === "custom_outfit" && booking.measurementType === "self") {
    return booking.measurements || null
  }
  if (booking.service === "alteration") {
    return booking.alterationMeasurements || null
  }
  return null
}

export default function BookingVerifyPage() {
  const router                = useRouter()
  const [email, setEmail]     = useState("")
  const [otp, setOtp]         = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [booking, setBooking] = useState(null)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) { setError("Please enter your email address."); return }
    if (!otp.trim())   { setError("Please enter your verification code."); return }
    if (otp.length !== 6) { setError("The verification code must be 6 digits."); return }

    setLoading(true)
    try {
      const res = await fetch("/api/booking/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email: email.toLowerCase().trim(),
          otp:   otp.trim(),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.expired
          ? "This verification code has expired. Please contact us directly."
          : data.error || "Invalid email or verification code.")
        return
      }
      setBooking(data.booking)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Booking summary view ── */
  if (booking) {
    const rows        = buildSummaryRows(booking)
    const measurements = getMeasurements(booking)

    return (
      <main className="min-h-screen bg-off-white flex items-start justify-center px-5 py-16">
        <div className="w-full max-w-[560px] bg-white rounded-[20px] border border-border-light shadow-[0_4px_24px_rgba(0,0,0,.06)] p-10">

          {/* Header */}
          <div className="flex items-center gap-4 mb-7 pb-6 border-b border-border-light">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shrink-0" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[1.125rem] font-bold text-text-primary tracking-tight">
                Booking confirmed
              </h1>
              <p className="text-[.8125rem] text-text-secondary mt-0.5">
                Here is your full booking summary
              </p>
            </div>
          </div>

          {/* Dynamic summary */}
          <div className="review-table mb-6">
            {rows.map((row) => (
              <div className="review-row" key={row.label}>
                <span className="review-label">{row.label}</span>
                <span
                  className="review-value"
                  style={{
                    color: row.isPayment ? "#16A34A" : undefined,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Measurements — only when applicable */}
          {measurements && Object.keys(measurements).some(
            (k) => k !== "notes" && measurements[k]
          ) && (
            <div className="mb-6">
              <p className="text-[.8125rem] font-semibold text-text-secondary uppercase tracking-[.06em] mb-3">
                {booking.service === "alteration"
                  ? "Your measurements"
                  : "Submitted measurements"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(measurements)
                  .filter(([key, val]) => key !== "notes" && val)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="px-3.5 py-2.5 rounded-xl bg-off-white border border-border-light"
                    >
                      <p className="text-[.7rem] font-medium text-text-muted capitalize mb-0.5">
                        {key}
                      </p>
                      <p className="text-[.9375rem] font-semibold text-text-primary">
                        {val}"
                      </p>
                    </div>
                  ))}
              </div>
              {measurements.notes && (
                <div className="mt-2 px-3.5 py-3 rounded-xl bg-off-white border border-border-light">
                  <p className="text-[.8125rem] font-semibold text-text-primary mb-1">Notes</p>
                  <p className="text-[.875rem] text-text-secondary leading-relaxed">
                    {measurements.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border-light">
            <span className="text-[.8rem] text-text-muted">
              Need help? Contact us directly.
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-[.875rem] font-semibold text-text-secondary hover:text-navy transition-colors"
              >
                ← Go back
              </button>
              <Link
                href="/"
                className="text-[.875rem] font-semibold text-navy no-underline"
              >
                Back to home →
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── Verify form ── */
  return (
    <main className="min-h-screen bg-off-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] border border-border-light shadow-[0_4px_24px_rgba(0,0,0,.06)] p-11">

        <Link href="/" className="flex items-center gap-2 no-underline mb-8">
          <div className="w-[30px] h-[30px] rounded-lg bg-navy flex items-center justify-center" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="text-[.9375rem] font-bold text-navy tracking-tight">FlowTrack</span>
        </Link>

        <div className="mb-7">
          <h1 className="text-[1.5rem] font-bold text-text-primary tracking-tight mb-2">
            View your booking
          </h1>
          <p className="text-[.9375rem] text-text-secondary leading-relaxed">
            Enter the email you used when booking and the 6-digit code we sent you.
          </p>
        </div>

        <form onSubmit={handleVerify} noValidate className="flex flex-col gap-4">
          <div className="booking-field">
            <label htmlFor="verify-email">Email address</label>
            <input
              id="verify-email"
              type="email"
              placeholder="james@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              autoComplete="email"
              required
            />
          </div>

          <div className="booking-field">
            <label htmlFor="verify-otp">6-digit verification code</label>
            <input
              id="verify-otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="e.g. 847291"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError("") }}
              autoComplete="one-time-code"
              className="text-xl tracking-[.2em] font-semibold"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-error text-[.8125rem]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-continue w-full justify-center mt-1"
            disabled={loading}
            aria-label="Verify and view booking"
          >
            {loading ? "Verifying..." : "View my booking"}
            {!loading && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </form>

        <p className="text-[.8rem] text-text-muted text-center mt-5 leading-relaxed">
          The code was sent to your email after payment. It expires 24 hours after your booking was confirmed.
        </p>
      </div>
    </main>
  )
}
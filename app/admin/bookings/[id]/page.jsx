import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Link from "next/link"
import AdminNav from "@/components/admin/AdminNav"

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
 * Build summary rows dynamically based on service type.
 * Only shows rows that are relevant and have a value.
 */
const buildRows = (b) => {
  const rows = []

  rows.push({ label: "Service", value: SERVICE_LABELS[b.service] || b.service })

  // Custom outfit
  if (b.service === "custom_outfit") {
    if (b.outfitStyle) {
      rows.push({ label: "Style", value: OUTFIT_LABELS[b.outfitStyle] || b.outfitStyle })
    }
  }

  // Alteration
  if (b.service === "alteration") {
    if (b.alterationType) {
      rows.push({
        label: "Alteration type",
        value: ALTERATION_LABELS[b.alterationType] || b.alterationType,
      })
    }
    if (b.alterationDetails?.trim()) {
      rows.push({ label: "Alteration details", value: b.alterationDetails })
    }
  }

  // Consultation
  if (b.service === "consultation") {
    if (b.consultationFormat) {
      rows.push({
        label: "Session format",
        value: CONSULTATION_FORMAT_LABELS[b.consultationFormat] || b.consultationFormat,
      })
    }
    if (b.consultationTopics?.trim()) {
      rows.push({ label: "Topics", value: b.consultationTopics })
    }
  }

  rows.push({ label: "Date", value: formatDate(b.appointmentDate) })
  rows.push({ label: "Time", value: b.appointmentTime || "—" })

  if (b.service === "custom_outfit" && b.measurementType) {
    rows.push({
      label: "Measurement",
      value: b.measurementType === "physical" ? "Come in for fitting" : "Self-submitted",
    })
  }

  rows.push({ label: "Name",        value: b.name })
  rows.push({ label: "Email",       value: b.email })
  rows.push({ label: "Phone",       value: b.phone })
  rows.push({ label: "Payment ref", value: b.paymentRef })
  rows.push({ label: "Booked on",   value: formatDate(b.createdAt) })

  return rows
}

/**
 * Get the measurements object to display based on service.
 * Returns null if no measurements should be shown.
 */
const getMeasurements = (b) => {
  if (b.service === "custom_outfit" && b.measurementType === "self") {
    return { data: b.measurements, title: "Submitted measurements" }
  }
  if (b.service === "alteration" && b.alterationMeasurements) {
    return { data: b.alterationMeasurements, title: "Customer measurements" }
  }
  return null
}

export const metadata = {
  title: "Booking Detail — FlowTrack Admin",
}

export default async function BookingDetailPage({ params }) {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const { id } = await params

  await connectDB()

  const booking = await Booking.findById(id).lean()
  if (!booking) notFound()

  const b            = JSON.parse(JSON.stringify(booking))
  const rows         = buildRows(b)
  const measurements = getMeasurements(b)

  // Subtitle for the booking header
  const subtitle = b.service === "custom_outfit"
    ? (OUTFIT_LABELS[b.outfitStyle] || "—")
    : b.service === "alteration"
    ? (ALTERATION_LABELS[b.alterationType] || "Alteration booking")
    : b.service === "consultation"
    ? (CONSULTATION_FORMAT_LABELS[b.consultationFormat] || "Consultation booking")
    : "—"

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-off-white pt-20 pb-12">
        <div className="container">

          {/* Back link */}
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-[.875rem] font-semibold text-text-secondary no-underline mb-6 hover:text-navy transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to dashboard
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Booking summary */}
              <div className="bg-white rounded-[20px] border border-border-light p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-border-light">
                  <div>
                    <h1 className="text-[1.25rem] font-bold text-text-primary tracking-tight">
                      {SERVICE_LABELS[b.service] || b.service}
                    </h1>
                    <p className="text-[.875rem] text-text-secondary mt-1">
                      {subtitle}
                    </p>
                  </div>
                  <span className={[
                    "text-[.7rem] font-semibold px-3 py-1.5 rounded-full tracking-[.06em] uppercase shrink-0",
                    b.paymentStatus === "paid"
                      ? "bg-[#F0FDF4] text-success border border-[#BBF7D0]"
                      : "bg-[#FEF2F2] text-error border border-[#FECACA]",
                  ].join(" ")}>
                    {b.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>

                {/* Dynamic rows */}
                <div className="review-table">
                  {rows.map((row) => (
                    <div className="review-row" key={row.label}>
                      <span className="review-label">{row.label}</span>
                      <span className="review-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurements — only when applicable */}
              {measurements && Object.keys(measurements.data || {}).some(
                (k) => k !== "notes" && measurements.data[k]
              ) && (
                <div className="bg-white rounded-[20px] border border-border-light p-6 md:p-8">
                  <h2 className="text-[1rem] font-bold text-text-primary mb-5">
                    {measurements.title}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(measurements.data)
                      .filter(([key, val]) => key !== "notes" && val)
                      .map(([key, val]) => (
                        <div
                          key={key}
                          className="px-4 py-3 rounded-xl bg-off-white border border-border-light"
                        >
                          <p className="text-[.7rem] font-medium text-text-muted capitalize mb-1">
                            {key}
                          </p>
                          <p className="text-[1rem] font-bold text-text-primary">
                            {val}"
                          </p>
                        </div>
                      ))}
                  </div>
                  {measurements.data.notes && (
                    <div className="mt-4 px-4 py-3 rounded-xl bg-off-white border border-border-light">
                      <p className="text-[.8125rem] font-semibold text-text-primary mb-1">Notes</p>
                      <p className="text-[.875rem] text-text-secondary leading-relaxed">
                        {measurements.data.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Special requests */}
              {b.specialRequests && (
                <div className="bg-white rounded-[20px] border border-border-light p-6 md:p-8">
                  <h2 className="text-[1rem] font-bold text-text-primary mb-3">
                    Special requests
                  </h2>
                  <p className="text-[.9375rem] text-text-secondary leading-relaxed">
                    {b.specialRequests}
                  </p>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-6">

              {/* Customer info */}
              <div className="bg-white rounded-[20px] border border-border-light p-6">
                <h2 className="text-[.875rem] font-bold text-text-primary uppercase tracking-[.06em] mb-4">
                  Customer
                </h2>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[.75rem] text-text-muted font-medium mb-0.5">Name</p>
                    <p className="text-[.9375rem] font-semibold text-text-primary">{b.name}</p>
                  </div>
                  <div>
                    <p className="text-[.75rem] text-text-muted font-medium mb-0.5">Email</p>
                    <a href={`mailto:${b.email}`} className="text-[.9375rem] font-semibold text-navy no-underline">
                      {b.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-[.75rem] text-text-muted font-medium mb-0.5">Phone</p>
                    <a href={`tel:${b.phone}`} className="text-[.9375rem] font-semibold text-navy no-underline">
                      {b.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Amount paid */}
              {b.amount > 0 && (
                <div className="bg-white rounded-[20px] border border-border-light p-6">
                  <h2 className="text-[.875rem] font-bold text-text-primary uppercase tracking-[.06em] mb-4">
                    Amount paid
                  </h2>
                  <p className="text-[1.5rem] font-bold text-navy tracking-tight">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(b.amount)}
                  </p>
                </div>
              )}

              {/* Verification status */}
              <div className="bg-white rounded-[20px] border border-border-light p-6">
                <h2 className="text-[.875rem] font-bold text-text-primary uppercase tracking-[.06em] mb-4">
                  Verification
                </h2>
                <div className={[
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-[.8125rem] font-semibold",
                  b.otpVerified
                    ? "bg-[#F0FDF4] text-success border border-[#BBF7D0]"
                    : "bg-off-white text-text-secondary border border-border-light",
                ].join(" ")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    {b.otpVerified
                      ? <polyline points="20 6 9 17 4 12"/>
                      : <circle cx="12" cy="12" r="10"/>
                    }
                  </svg>
                  {b.otpVerified ? "Customer has verified" : "Not yet verified"}
                </div>
              </div>

              {/* Contact customer */}
              <div className="bg-white rounded-[20px] border border-border-light p-6">
                <h2 className="text-[.875rem] font-bold text-text-primary uppercase tracking-[.06em] mb-4">
                  Contact customer
                </h2>
                <div className="flex flex-col gap-2">
                  < a
                    href={`mailto:${b.email}?subject=Your FlowTrack Booking`}
                    className="hero-cta-secondary justify-center text-[.875rem] py-3"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Send email
                  </a>
                  <a
                    href={`tel:${b.phone}`}
                    className="hero-cta-secondary justify-center text-[.875rem] py-3"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    Call customer
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}
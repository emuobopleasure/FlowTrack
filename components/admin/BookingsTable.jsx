"use client"

import { useRouter } from "next/navigation"

const SERVICE_LABELS = {
  custom_outfit: "Custom Outfit",
  alteration:    "Alteration",
  consultation:  "Styling Consultation",
}

const formatDate = (dateStr) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  })
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)

export default function BookingsTable({ bookings }) {
  const router = useRouter()

  if (!bookings?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center mb-4" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1.75" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
        </div>
        <p className="text-[.9375rem] font-semibold text-text-primary mb-1">No bookings yet</p>
        <p className="text-[.875rem] text-text-secondary">
          Confirmed bookings will appear here after customers complete payment.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-light">
            {["Customer", "Service", "Date", "Measurement", "Status", "Booked"].map((h) => (
              <th
                key={h}
                className="pb-3 text-[.75rem] font-semibold text-text-muted uppercase tracking-[.06em] pr-6 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              onClick={() => router.push(`/admin/bookings/${booking._id}`)}
              className="border-b border-border-light cursor-pointer group"
              style={{ transition: "background 150ms" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F5F5F0"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <td className="py-4 pr-6">
                <p className="text-[.9375rem] font-semibold text-text-primary leading-tight">
                  {booking.name}
                </p>
                <p className="text-[.8rem] text-text-muted mt-0.5">{booking.email}</p>
              </td>
              <td className="py-4 pr-6 text-[.875rem] text-text-secondary whitespace-nowrap">
                {SERVICE_LABELS[booking.service] || booking.service}
              </td>
              <td className="py-4 pr-6 text-[.875rem] text-text-secondary whitespace-nowrap">
                {formatDate(booking.appointmentDate)}
              </td>
              <td className="py-4 pr-6">
                <span className={[
                  "text-[.7rem] font-semibold px-2.5 py-1 rounded-full uppercase tracking-[.04em]",
                  booking.measurementType === "physical"
                    ? "bg-[#EEF3FB] text-navy"
                    : "bg-off-white text-text-secondary border border-border-light",
                ].join(" ")}>
                  {booking.measurementType === "physical" ? "In-studio" : "Remote"}
                </span>
              </td>
              <td className="py-4 pr-6">
                <span className={[
                  "text-[.7rem] font-semibold px-2.5 py-1 rounded-full uppercase tracking-[.04em]",
                  booking.paymentStatus === "paid"
                    ? "bg-[#F0FDF4] text-success border border-[#BBF7D0]"
                    : "bg-[#FEF2F2] text-error border border-[#FECACA]",
                ].join(" ")}>
                  {booking.paymentStatus}
                </span>
              </td>
              <td className="py-4 pr-6 text-[.875rem] text-text-muted whitespace-nowrap">
                {formatDate(booking.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
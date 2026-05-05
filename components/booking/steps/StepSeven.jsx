"use client"

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

const PRICES = {
  custom_outfit: 45000,
  alteration:    8000,
  consultation:  15000,
}

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)

export default function StepSeven({
  formData,
  prevStep,
  anonymousSessionId,
  isSubmitting,
  setIsSubmitting,
  setError,
}) {
  const router = useRouter()
  const price = PRICES[formData.service] || 45000

  const rows = [
    { label: "Service",     value: SERVICE_LABELS[formData.service] || "—" },
    { label: "Style",       value: OUTFIT_LABELS[formData.outfitStyle] || "—" },
    {
      label: "Appointment",
      value: formData.appointmentDate && formData.appointmentTime
        ? `${formData.appointmentDate} · ${formData.appointmentTime}`
        : "—",
    },
    {
      label: "Measurement",
      value: formData.measurementType === "physical"
        ? "Come in for fitting"
        : "Self-submitted",
    },
    { label: "Name",  value: formData.name  || "—" },
    { label: "Email", value: formData.email || "—" },
    { label: "Phone", value: formData.phone || "—" },
  ]

  const handlePayment = () => {
    setIsSubmitting(true)

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: price * 100,
      currency: "NGN",
      metadata: { name: formData.name, phone: formData.phone },
      onClose: () => { setIsSubmitting(false) },
      callback: async (response) => {
        try {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference }),
          })
          const verifyData = await verifyRes.json()
          if (!verifyData.success) throw new Error("Payment verification failed")

          const bookRes = await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              paymentRef: response.reference,
              anonymousSessionId,
            }),
          })
          const bookData = await bookRes.json()
          if (!bookData.success) throw new Error("Booking confirmation failed")

          router.push("/confirmation")
        } catch {
          setError("Payment went through but something went wrong confirming your booking. Please contact us.")
          setIsSubmitting(false)
        }
      },
    })

    handler.openIframe()
  }

  return (
    <div className="booking-card">

      <div className="mb-7">
        <div className="step-eyebrow">Step 7 of 7</div>
        <h2 className="step-title">Review and pay</h2>
        <p className="step-sub">Check your details before completing your payment.</p>
      </div>

      <div className="review-table mb-4">
        {rows.map((row) => (
          <div className="review-row" key={row.label}>
            <span className="review-label">{row.label}</span>
            <span className="review-value">{row.value}</span>
          </div>
        ))}
        <div className="review-row total">
          <span className="review-label">Total</span>
          <span className="review-value">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="info-box green">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Payment is processed securely via Paystack. Your booking is confirmed immediately after payment.</span>
      </div>

      {/* Paystack inline script */}
      <script src="https://js.paystack.co/v1/inline.js" async />

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to your details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button
          className="btn-pay"
          onClick={handlePayment}
          disabled={isSubmitting}
          aria-label={`Pay ${formatPrice(price)} to confirm your booking`}
        >
          {isSubmitting ? "Processing..." : `Pay ${formatPrice(price)}`}
          {!isSubmitting && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
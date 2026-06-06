"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAnalytics } from "@/hooks/useAnalytics"

const SERVICE_LABELS = {
    custom_outfit: "Custom Outfit",
    alteration: "Alteration",
    consultation: "Styling Consultation",
}

const OUTFIT_LABELS = {
    agbada: "Agbada",
    senator: "Senator Suit",
    kaftan: "Kaftan",
    ankara_shirt: "Ankara Shirt",
    babariga: "Babariga",
    aso_oke: "Aso-Oke Set",
}

const ALTERATION_LABELS = {
    resize: "Resizing",
    hemming: "Hemming",
    repair: "Repair",
    restructure: "Restructure",
}

const CONSULTATION_FORMAT_LABELS = {
    in_person: "In-person session",
    online: "Online session",
}

const PRICES = {
    custom_outfit: 45000,
    alteration: 8000,
    consultation: 15000,
}

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(amount)

/**
 * Build review rows dynamically based on the selected service.
 * Only include rows that are relevant and have a value.
 */
const buildReviewRows = (formData) => {
    const rows = []
    const { service } = formData

    // Service — always shown
    rows.push({
        label: "Service",
        value: SERVICE_LABELS[service] || service,
    })

    // Custom outfit specific
    if (service === "custom_outfit") {
        if (formData.outfitStyle) {
            rows.push({
                label: "Style",
                value: OUTFIT_LABELS[formData.outfitStyle] || formData.outfitStyle,
            })
        }
    }

    // Alteration specific
    if (service === "alteration") {
        if (formData.alterationType) {
            rows.push({
                label: "Alteration type",
                value: ALTERATION_LABELS[formData.alterationType] || formData.alterationType,
            })
        }
        if (formData.alterationDetails?.trim()) {
            rows.push({
                label: "Alteration details",
                value: formData.alterationDetails,
            })
        }
    }

    // Consultation specific
    if (service === "consultation") {
        if (formData.consultationFormat) {
            rows.push({
                label: "Session format",
                value: CONSULTATION_FORMAT_LABELS[formData.consultationFormat] || formData.consultationFormat,
            })
        }
        if (formData.consultationTopics?.trim()) {
            rows.push({
                label: "Topics",
                value: formData.consultationTopics,
            })
        }
    }

    // Appointment — always shown
    rows.push({
        label: "Date",
        value: formData.appointmentDate || "—",
    })
    rows.push({
        label: "Time",
        value: formData.appointmentTime || "—",
    })

    // Measurement method — custom outfit only
    if (service === "custom_outfit" && formData.measurementType) {
        rows.push({
            label: "Measurement",
            value: formData.measurementType === "physical"
                ? "Come in for fitting"
                : "Self-submitted",
        })
    }

    // Alteration measurements
    if (service === "alteration" && formData.alterationMeasurements) {
        const m = formData.alterationMeasurements
        const filled = Object.entries(m)
            .filter(([key, val]) => key !== "notes" && val)
            .map(([key, val]) => `${key}: ${val}"`)
            .join(", ")
        if (filled) {
            rows.push({ label: "Measurements", value: filled })
        }
    }

    // Custom outfit self measurements
    if (service === "custom_outfit" && formData.measurementType === "self" && formData.measurements) {
        const m = formData.measurements
        const filled = Object.entries(m)
            .filter(([key, val]) => key !== "notes" && val)
            .map(([key, val]) => `${key}: ${val}"`)
            .join(", ")
        if (filled) {
            rows.push({ label: "Measurements", value: filled })
        }
    }

    // Customer details — always shown
    rows.push({ label: "Name", value: formData.name || "—" })
    rows.push({ label: "Email", value: formData.email || "—" })
    rows.push({ label: "Phone", value: formData.phone || "—" })

    // Special requests — only if filled
    if (formData.specialRequests?.trim()) {
        rows.push({ label: "Special requests", value: formData.specialRequests })
    }

    return rows
}

export default function StepSeven({
    formData,
    prevStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    setError,
    currentStep,
    totalSteps,
}) {


    const { trackCompleted } = useAnalytics({
        step: currentStep,
        anonymousSessionId,
        email: formData.email,
        
    })

    const router = useRouter()
    const price = PRICES[formData.service] || 45000

    const [paystackReady, setPaystackReady] = useState(false)
    const [localError, setLocalError] = useState("")

    useEffect(() => {
        if (window.PaystackPop) { setPaystackReady(true); return }
        const script = document.createElement("script")
        script.src = "https://js.paystack.co/v1/inline.js"
        script.async = true
        script.onload = () => setPaystackReady(true)
        script.onerror = () => setLocalError("Could not load the payment system. Please refresh and try again.")
        document.body.appendChild(script)
    }, [])

    const rows = buildReviewRows(formData)

    const handlePayment = () => {
        setLocalError("")

        if (!window.PaystackPop) {
            setLocalError("Payment system is still loading. Please wait a moment and try again.")
            return
        }
        if (!formData.email?.trim()) {
            setLocalError("Email address is missing. Please go back to step 5.")
            return
        }
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
        if (!paystackKey) {
            setLocalError("Payment is not configured. Please contact us directly.")
            return
        }

        setIsSubmitting(true)

        const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: formData.email.trim(),
            amount: price * 100,
            currency: "NGN",
            metadata: {
                custom_fields: [
                    { display_name: "Customer Name", variable_name: "name", value: formData.name },
                    { display_name: "Phone", variable_name: "phone", value: formData.phone },
                ],
            },
            onClose: () => {
                setIsSubmitting(false)
            },
            // ── callback must be a plain function, not async ──
            callback: (response) => {
                const reference = response.reference

                // Step 1 — verify payment server-side
                fetch("/api/payment/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reference }),
                })
                    .then((res) => res.json())
                    .then((verifyData) => {
                        if (!verifyData.success) throw new Error("Payment verification failed")

                        // Step 2 — confirm booking
                        return fetch("/api/booking", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...formData,
                                paymentRef: reference,
                                anonymousSessionId,
                            }),
                        })
                    })
                    .then((res) => res.json())
                    .then((bookData) => {
                        if (!bookData.success) throw new Error("Booking confirmation failed")
                        trackCompleted()
                        // Step 3 — redirect
                        router.push("/confirmation")
                    })
                    .catch(() => {
                        setLocalError(
                            `Payment was successful but we could not confirm your booking automatically. ` +
                            `Please contact us with your payment reference: ${reference}`
                        )
                        setIsSubmitting(false)
                    })
            },
        })

        handler.openIframe()
    }

    return (
        <div className="booking-card">
            <div className="mb-7">
                <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
                <h2 className="step-title">Review and pay</h2>
                <p className="step-sub">Check your details before completing your payment.</p>
            </div>

            {/* Dynamic booking summary */}
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

            {/* Security note */}
            <div className="info-box green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>
                    Payment is processed securely via Paystack. Your booking is confirmed immediately after payment.
                </span>
            </div>

            {/* Error */}
            {localError && (
                <div role="alert" className="flex items-start gap-3 px-4 py-3 mt-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 mt-0.5 text-error" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <p className="text-[.8125rem] text-error leading-relaxed">{localError}</p>
                </div>
            )}

            {/* Paystack loading */}
            {!paystackReady && !localError && (
                <div className="flex items-center gap-2 mt-3 text-[.8125rem] text-text-secondary">
                    <svg className="w-4 h-4 animate-spin text-navy" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
                        <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" fillOpacity=".75" />
                    </svg>
                    Loading payment system...
                </div>
            )}

            <div className="step-actions">
                <button className="btn-back" onClick={prevStep} disabled={isSubmitting} aria-label="Go back">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                </button>
                <button
                    className="btn-pay"
                    onClick={handlePayment}
                    disabled={isSubmitting || !paystackReady}
                    aria-label={`Pay ${formatPrice(price)} to confirm your booking`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
                                <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" fillOpacity=".75" />
                            </svg>
                            Processing...
                        </>
                    ) : !paystackReady ? "Loading..." : (
                        <>
                            Pay {formatPrice(price)}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function StepSeven({
    formData,
    prevStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    currentStep,
    totalSteps,
}) {
    const router = useRouter()
    const price = PRICES[formData.service] || 45000

    const [paystackReady, setPaystackReady] = useState(false)
    const [localError, setLocalError] = useState("")

    useEffect(() => {
        // Already loaded
        if (window.PaystackPop) {
            setPaystackReady(true)
            return
        }

        // Inject script
        const script = document.createElement("script")
        script.src = "https://js.paystack.co/v1/inline.js"
        script.async = true
        script.onload = () => setPaystackReady(true)
        script.onerror = () =>
            setLocalError(
                "Could not load the payment system. Please check your connection and refresh the page."
            )
        document.body.appendChild(script)

        return () => {
            // Leave the script in the DOM — removing it breaks Paystack
        }
    }, [])

    const rows = [
        {
            label: "Service",
            value: SERVICE_LABELS[formData.service] || "—",
        },
        {
            label: "Style",
            value: OUTFIT_LABELS[formData.outfitStyle] || "—",
        },
        {
            label: "Appointment",
            value:
                formData.appointmentDate && formData.appointmentTime
                    ? `${formData.appointmentDate} · ${formData.appointmentTime}`
                    : "—",
        },
        {
            label: "Measurement",
            value:
                formData.measurementType === "physical"
                    ? "Come in for fitting"
                    : formData.measurementType === "self"
                        ? "Self-submitted"
                        : "—",
        },
        { label: "Name", value: formData.name || "—" },
        { label: "Email", value: formData.email || "—" },
        { label: "Phone", value: formData.phone || "—" },
    ]

    const handlePayment = () => {
        setLocalError("");

        if (!window.PaystackPop) {
            setLocalError("Payment system is still loading. Please wait.");
            return;
        }

        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!paystackKey) {
            setLocalError("Payment configuration missing.");
            return;
        }

        setIsSubmitting(true);

        // Create the handler
        const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: formData.email.trim(),
            amount: price * 100,
            currency: "NGN",
            metadata: {
                custom_fields: [
                    { display_name: "Name", variable_name: "name", value: formData.name },
                    { display_name: "Phone", variable_name: "phone", value: formData.phone },
                ],
            },
            // Remove 'async' from the property level
            callback: function (response) {
                // Execute the async verification inside a self-invoking function or a helper
                handleVerification(response);
            },
            onClose: function () {
                setIsSubmitting(false);
            },
        });

        handler.openIframe();
    };

    // Move the async logic here
    const handleVerification = async (response) => {
        try {
            // 1. Verify server-side
            const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: response.reference }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error("Verification failed");

            // 2. Confirm booking
            const bookRes = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    paymentRef: response.reference,
                    anonymousSessionId,
                }),
            });
            const bookData = await bookRes.json();
            if (!bookData.success) throw new Error("Booking failed");

            router.push("/confirmation");
        } catch (err) {
            setLocalError(
                `Payment successful, but confirmation failed. Ref: ${response.reference}`
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className="booking-card">

            {/* Header */}
            <div className="mb-7">
                <div className="step-eyebrow">
                    Step {currentStep} of {totalSteps}
                </div>
                <h2 className="step-title">Review and pay</h2>
                <p className="step-sub">
                    Check your details before completing your payment.
                </p>
            </div>

            {/* Booking summary */}
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
                <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" className="shrink-0 mt-0.5"
                    aria-hidden="true"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>
                    Payment is processed securely via Paystack. Your booking is
                    confirmed immediately after payment.
                </span>
            </div>

            {/* Error — shown inside the card, below the security note */}
            {localError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 px-4 py-3 mt-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
                >
                    <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="currentColor" className="shrink-0 mt-0.5 text-error"
                        aria-hidden="true"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <p className="text-[.8125rem] text-error leading-relaxed">{localError}</p>
                </div>
            )}

            {/* Paystack loading indicator */}
            {!paystackReady && !localError && (
                <div className="flex items-center gap-2 mt-3 text-[.8125rem] text-text-secondary">
                    <svg
                        className="w-4 h-4 animate-spin text-navy"
                        viewBox="0 0 24 24" fill="none"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
                        <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" fillOpacity=".75" />
                    </svg>
                    Loading payment system...
                </div>
            )}

            {/* Actions */}
            <div className="step-actions">
                <button
                    className="btn-back"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    aria-label="Go back to your details"
                >
                    <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" aria-hidden="true"
                    >
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
                            <svg
                                className="w-4 h-4 animate-spin"
                                viewBox="0 0 24 24" fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor" strokeWidth="3" strokeOpacity=".25"
                                />
                                <path
                                    d="M4 12a8 8 0 018-8v8z"
                                    fill="currentColor" fillOpacity=".75"
                                />
                            </svg>
                            Processing...
                        </>
                    ) : !paystackReady ? (
                        "Loading..."
                    ) : (
                        <>
                            Pay {formatPrice(price)}
                            <svg
                                width="15" height="15" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.5"
                                strokeLinecap="round" aria-hidden="true"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
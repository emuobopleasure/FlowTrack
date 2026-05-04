"use client"

/**
 * StepFive — Email Gate (Save Progress)
 *
 * Progressive commitment pattern:
 * User has already invested time in steps 1–4.
 * Email is requested here — framed as saving progress,
 * not as registration.
 *
 * On submit:
 * - Creates/updates session in MongoDB with email as identifier
 * - From this point, email is the persistent key
 */

import { useState } from "react"

export default function StepFive({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  anonymousSessionId,
  isSubmitting,
  setIsSubmitting,
  setError,
}) {
  const [localError, setLocalError] = useState("")

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleContinue = async () => {
    const email = formData.email?.trim()

    if (!email) {
      setLocalError("Please enter your email address.")
      return
    }
    if (!validateEmail(email)) {
      setLocalError("Please enter a valid email address.")
      return
    }

    setLocalError("")
    setIsSubmitting(true)

    try {
      // Link anonymous session to email in MongoDB
      const res = await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousSessionId,
          email: email.toLowerCase(),
          currentStep: 5,
          formData,
        }),
      })

      if (!res.ok) throw new Error("Failed to save progress")
      nextStep()
    } catch (err) {
      setError("Something went wrong saving your progress. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-card">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div className="step-eyebrow">Step 5 of 7</div>
        <div className="step-title">Save your progress</div>
        <div className="step-sub">
          Enter your email to save your booking and receive your confirmation. No account or password needed.
        </div>
      </div>

      {/* Email field */}
      <div className="booking-field" style={{ marginBottom: "16px" }}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="james@example.com"
          value={formData.email || ""}
          onChange={(e) => {
            updateFormData({ email: e.target.value })
            if (localError) setLocalError("")
          }}
          onKeyDown={(e) => { if (e.key === "Enter") handleContinue() }}
          aria-describedby={localError ? "email-error" : undefined}
          aria-invalid={!!localError}
          style={{
            borderColor: localError ? "#DC2626" : undefined,
          }}
        />
        {localError && (
          <span
            id="email-error"
            role="alert"
            style={{ fontSize: ".8125rem", color: "#DC2626", marginTop: "4px" }}
          >
            {localError}
          </span>
        )}
      </div>

      {/* Reassurance box */}
      <div className="info-box blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div>
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            Your progress is protected
          </div>
          <div>
            We only use your email to save your booking and send your confirmation code. No marketing, no spam.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to measurements">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button
          className="btn-continue"
          onClick={handleContinue}
          disabled={isSubmitting}
          aria-label="Save progress and continue to your details"
        >
          {isSubmitting ? "Saving..." : "Save and continue"}
          {!isSubmitting && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
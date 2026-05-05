"use client"

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleContinue = async () => {
    const email = formData.email?.trim()
    if (!email) { setLocalError("Please enter your email address."); return }
    if (!validateEmail(email)) { setLocalError("Please enter a valid email address."); return }

    setLocalError("")
    setIsSubmitting(true)

    try {
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
    } catch {
      setError("Something went wrong saving your progress. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-card">

      <div className="mb-7">
        <div className="step-eyebrow">Step 5 of 7</div>
        <h2 className="step-title">Save your progress</h2>
        <p className="step-sub">
          Enter your email to save your booking and receive your confirmation. No account or password needed.
        </p>
      </div>

      <div className="booking-field mb-4">
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
          className={localError ? "border-error!" : ""}
        />
        {localError && (
          <span
            id="email-error"
            role="alert"
            className="text-[.8125rem] text-error mt-1"
          >
            {localError}
          </span>
        )}
      </div>

      <div className="info-box blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div>
          <p className="font-semibold mb-1">Your progress is protected</p>
          <p>We only use your email to save your booking and send your confirmation code. No marketing, no spam.</p>
        </div>
      </div>

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
          aria-label="Save progress and continue"
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
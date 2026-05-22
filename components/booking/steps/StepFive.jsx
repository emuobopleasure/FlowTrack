"use client"

import { useState } from "react"
import { useAnalytics } from "@/hooks/useAnalytics"

export default function StepFive({
  formData,
  updateFormData,
  nextStep,
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

  const [localError, setLocalError] = useState("")
  const [saved, setSaved] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

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
    setSaved(false)

    try {
      // First ensure session exists
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousSessionId }),
      })

      // Then link email and save progress
      const res = await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousSessionId,
          email: email.toLowerCase(),
          currentStep,
          formData,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save progress")
      }

      setSaved(true)

      trackCompleted()

      // Short delay so the user sees the saved confirmation
      setTimeout(() => {
        nextStep()
      }, 600)

    } catch (err) {
      setLocalError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-card">
      <div className="mb-7">
        <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
        <h2 className="step-title">Save your progress</h2>
        <p className="step-sub">
          Enter your email to save your booking and receive your confirmation. No account or password needed.
        </p>
      </div>

      <div className="booking-field mb-4">
        <label htmlFor="email">Email address <span className="text-error">*</span></label>
        <input
          id="email"
          type="email"
          placeholder="james@example.com"
          value={formData.email || ""}
          onChange={(e) => {
            updateFormData({ email: e.target.value })
            if (localError) setLocalError("")
            if (saved) setSaved(false)
          }}
          onKeyDown={(e) => { if (e.key === "Enter") handleContinue() }}
          aria-describedby={localError ? "email-error" : undefined}
          aria-invalid={!!localError}
          disabled={isSubmitting}
          style={{ borderColor: localError ? "#DC2626" : saved ? "#16A34A" : undefined }}
        />
        {localError && (
          <span
            id="email-error"
            role="alert"
            className="text-[.8125rem] text-error mt-1 flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {localError}
          </span>
        )}
        {saved && (
          <span className="text-[.8125rem] text-success mt-1 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Progress saved — continuing...
          </span>
        )}
      </div>

      {/* Reassurance */}
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
        <button
          className="btn-back"
          onClick={prevStep}
          disabled={isSubmitting}
          aria-label="Go back to measurements"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button
          className="btn-continue"
          onClick={handleContinue}
          disabled={isSubmitting || saved}
          aria-label="Save progress and continue to your details"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
                <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" fillOpacity=".75"/>
              </svg>
              Saving...
            </>
          ) : saved ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Saved
            </>
          ) : (
            <>
              Save and continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
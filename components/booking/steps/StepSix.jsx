"use client"
import { useAnalytics } from "@/hooks/useAnalytics"

export default function StepSix({ formData, updateFormData, nextStep, prevStep, currentStep, totalSteps, anonymousSessionId }) {

  const { trackCompleted } = useAnalytics({
    step: currentStep,
    anonymousSessionId,
    email: formData.email,
  })

  const canContinue = formData.name?.trim() && formData.phone?.trim()

  return (
    <div className="booking-card">

      <div className="mb-7">
        <div className="step-eyebrow">Step 6 of 7</div>
        <h2 className="step-title">Your details</h2>
        <p className="step-sub">Almost there. A few more details to complete your booking.</p>
      </div>

      <div className="field-row-2 mb-4">
        <div className="booking-field">
          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            type="text"
            placeholder="James Carter"
            value={formData.name || ""}
            onChange={(e) => updateFormData({ name: e.target.value })}
            autoComplete="name"
          />
        </div>
        <div className="booking-field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            placeholder="+234 801 234 5678"
            value={formData.phone || ""}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="booking-field">
        <label htmlFor="requests">Special requests (optional)</label>
        <textarea
          id="requests"
          placeholder="Any specific style preferences, fabric requests, embroidery details, or anything else the designer should know..."
          rows={4}
          value={formData.specialRequests || ""}
          onChange={(e) => updateFormData({ specialRequests: e.target.value })}
        />
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to save progress">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <button
          className="btn-continue"
          onClick={() => {
            trackCompleted()
            nextStep()
          }}
          disabled={!canContinue}
          aria-label="Review your booking"
        >
          Review booking
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { useAnalytics } from "@/hooks/useAnalytics"

const customFields = [
  { id: "chest", label: "Chest (inches)", placeholder: "e.g. 38" },
  { id: "waist", label: "Waist (inches)", placeholder: "e.g. 32" },
  { id: "hips", label: "Hips (inches)", placeholder: "e.g. 40" },
  { id: "shoulder", label: "Shoulder width (inches)", placeholder: "e.g. 18" },
  { id: "height", label: "Height (inches)", placeholder: "e.g. 70" },
  { id: "sleeve", label: "Sleeve length (inches)", placeholder: "e.g. 25" },
]

const alterationFields = [
  { id: "chest", label: "Chest (inches)", placeholder: "e.g. 38" },
  { id: "waist", label: "Waist (inches)", placeholder: "e.g. 32" },
  { id: "hips", label: "Hips (inches)", placeholder: "e.g. 40" },
  { id: "height", label: "Height (inches)", placeholder: "e.g. 70" },
]

export default function StepFour({
  formData,
  updateMeasurements,
  updateAlterationMeasurements,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
  alterationMode = false,
  anonymousSessionId,
}) {

  const { trackCompleted } = useAnalytics({
    step: currentStep,
    anonymousSessionId,
    email: formData.email,
  })

  const [errors, setErrors] = useState({})

  const isPhysical = formData.measurementType === "physical"
  const isSelf = formData.measurementType === "self"

  const measurements = alterationMode
    ? (formData.alterationMeasurements || {})
    : (formData.measurements || {})

  const updateFn = alterationMode
    ? updateAlterationMeasurements
    : updateMeasurements

  const fields = alterationMode ? alterationFields : customFields

  const validate = () => {
    if (isPhysical && !alterationMode) return {}
    const e = {}
    fields.forEach((field) => {
      const val = measurements[field.id]
      if (!val || String(val).trim() === "") {
        e[`meas-${field.id}`] = "Required"
      }
    })
    setErrors(e)
    return e
  }

  const handleContinue = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0]
      const el = document.getElementById(firstKey)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => el.focus(), 400)
      }
      return
    }
    trackCompleted()

    nextStep()
  }

  return (
    <div className="booking-card">
      <div className="mb-7">
        <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
        <h2 className="step-title">
          {alterationMode ? "Your current measurements" : "Measurements"}
        </h2>
        <p className="step-sub">
          {isPhysical && !alterationMode
            ? "You chose to come in for a fitting. Your measurements will be taken at the studio."
            : alterationMode
              ? "Enter your current measurements in inches so we can alter the garment correctly."
              : "Enter your measurements in inches. Use a flexible tape measure for accuracy."}
        </p>
      </div>

      {isPhysical && !alterationMode ? (
        <div className="info-box blue" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-semibold mb-1">Studio fitting confirmed</p>
            <p>
              Your measurements will be taken professionally at the studio on{" "}
              <strong>{formData.appointmentDate}</strong> at{" "}
              <strong>{formData.appointmentTime}</strong>.
              No action needed here, just continue.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="info-box blue mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              All fields marked * are required. Use a flexible measuring
              tape and measure over light clothing for accuracy.
            </span>
          </div>

          <div className="field-row-2">
            {fields.map((field) => (
              <div className="booking-field" key={field.id}>
                <label htmlFor={`meas-${field.id}`}>
                  {field.label} <span className="text-error">*</span>
                </label>
                <input
                  id={`meas-${field.id}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  placeholder={field.placeholder}
                  value={measurements[field.id] ?? ""}
                  onChange={(e) => {
                    updateFn({ [field.id]: e.target.value })
                    setErrors(prev => ({ ...prev, [`meas-${field.id}`]: "" }))
                  }}
                  style={{
                    borderColor: errors[`meas-${field.id}`] ? "#DC2626" : undefined,
                  }}
                  aria-invalid={!!errors[`meas-${field.id}`]}
                />
                {errors[`meas-${field.id}`] && (
                  <span className="text-[.75rem] text-error mt-0.5 block" role="alert">
                    This field is required
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="booking-field mt-4">
            <label htmlFor="meas-notes">Additional notes (optional)</label>
            <textarea
              id="meas-notes"
              rows={3}
              placeholder={
                alterationMode
                  ? "e.g. The trousers need to be taken in at the waist by 2 inches..."
                  : "e.g. I prefer a relaxed fit around the shoulders..."
              }
              value={measurements.notes ?? ""}
              onChange={(e) => updateFn({ notes: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <button className="btn-continue" onClick={handleContinue} aria-label="Continue">
          Continue
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
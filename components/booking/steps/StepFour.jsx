"use client"

import { useState } from "react"

const customFields = [
  { id: "chest",    label: "Chest (cm)",          placeholder: "e.g. 96" },
  { id: "waist",    label: "Waist (cm)",           placeholder: "e.g. 82" },
  { id: "hips",     label: "Hips (cm)",            placeholder: "e.g. 100" },
  { id: "shoulder", label: "Shoulder width (cm)",  placeholder: "e.g. 46" },
  { id: "height",   label: "Height (cm)",          placeholder: "e.g. 178" },
  { id: "sleeve",   label: "Sleeve length (cm)",   placeholder: "e.g. 64" },
]

const alterationFields = [
  { id: "chest",    label: "Chest (cm)",      placeholder: "e.g. 96" },
  { id: "waist",    label: "Waist (cm)",      placeholder: "e.g. 82" },
  { id: "hips",     label: "Hips (cm)",       placeholder: "e.g. 100" },
  { id: "height",   label: "Height (cm)",     placeholder: "e.g. 178" },
]

export default function StepFour({
  formData,
  updateFormData,
  updateMeasurements,
  updateAlterationMeasurements,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
  alterationMode = false,
}) {
  const [errors, setErrors] = useState({})
  const isPhysical = formData.measurementType === "physical"
  const isSelf = formData.measurementType === "self"

  const measurements = alterationMode
    ? formData.alterationMeasurements
    : formData.measurements

  const updateFn = alterationMode
    ? (updateAlterationMeasurements || updateMeasurements)
    : updateMeasurements

  const fields = alterationMode ? alterationFields : customFields

  const validate = () => {
    if (isPhysical || alterationMode === false && !isSelf) return true

    const e = {}
    fields.forEach((field) => {
      if (!measurements?.[field.id]?.trim()) {
        e[field.id] = "Required"
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) nextStep()
  }

  return (
    <div className="booking-card">
      <div className="mb-7">
        <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
        <h2 className="step-title">
          {alterationMode ? "Your current measurements" : "Measurements"}
        </h2>
        <p className="step-sub">
          {isPhysical
            ? "You chose to come in for a fitting. Your measurements will be taken at the studio."
            : alterationMode
            ? "Enter your current measurements so we can alter the garment correctly."
            : "Enter your measurements in centimetres. Use a flexible tape measure for accuracy."}
        </p>
      </div>

      {isPhysical && !alterationMode ? (
        /* Physical fitting — show confirmation, no form */
        <div className="info-box blue" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <p className="font-semibold mb-1">Studio fitting confirmed</p>
            <p>
              Your measurements will be taken professionally at the studio on{" "}
              <strong>{formData.appointmentDate}</strong> at{" "}
              <strong>{formData.appointmentTime}</strong>. No action needed here — just continue.
            </p>
          </div>
        </div>
      ) : (
        /* Measurement form */
        <>
          {isSelf && !alterationMode && (
            <div className="info-box blue mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>All fields are required. Use a flexible measuring tape and measure over light clothing for accuracy.</span>
            </div>
          )}

          <div className="field-row-2">
            {fields.map((field) => (
              <div className="booking-field" key={field.id}>
                <label htmlFor={`meas-${field.id}`}>
                  {field.label} <span className="text-error">*</span>
                </label>
                <input
                  id={`meas-${field.id}`}
                  type="number"
                  min="0"
                  placeholder={field.placeholder}
                  value={measurements?.[field.id] || ""}
                  onChange={(e) => {
                    updateFn({ [field.id]: e.target.value })
                    setErrors(prev => ({ ...prev, [field.id]: "" }))
                  }}
                  style={{ borderColor: errors[field.id] ? "#DC2626" : undefined }}
                  aria-invalid={!!errors[field.id]}
                />
                {errors[field.id] && (
                  <span className="text-[.75rem] text-error mt-0.5">Required</span>
                )}
              </div>
            ))}
          </div>

          <div className="booking-field mt-4">
            <label htmlFor="meas-notes">Additional notes (optional)</label>
            <textarea
              id="meas-notes"
              placeholder={
                alterationMode
                  ? "e.g. The trousers need to be taken in at the waist by 2 inches..."
                  : "e.g. I prefer a relaxed fit around the shoulders, longer hem length..."
              }
              rows={3}
              value={measurements?.notes || ""}
              onChange={(e) => updateFn({ notes: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button className="btn-continue" onClick={handleContinue}>
          Continue
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
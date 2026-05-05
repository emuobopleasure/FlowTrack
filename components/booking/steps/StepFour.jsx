"use client"

const fields = [
  { id: "chest",    label: "Chest (cm)",          placeholder: "e.g. 96" },
  { id: "waist",    label: "Waist (cm)",           placeholder: "e.g. 82" },
  { id: "hips",     label: "Hips (cm)",            placeholder: "e.g. 100" },
  { id: "shoulder", label: "Shoulder width (cm)",  placeholder: "e.g. 46" },
  { id: "height",   label: "Height (cm)",          placeholder: "e.g. 178" },
  { id: "sleeve",   label: "Sleeve length (cm)",   placeholder: "e.g. 64" },
]

export default function StepFour({ formData, updateFormData, updateMeasurements, nextStep, prevStep }) {
  const isPhysical = formData.measurementType === "physical"

  return (
    <div className="booking-card">

      <div className="mb-7">
        <div className="step-eyebrow">Step 4 of 7</div>
        <h2 className="step-title">Measurements</h2>
        <p className="step-sub">
          {isPhysical
            ? "You chose to come in for a fitting. Your measurements will be taken at the studio."
            : "Enter your measurements in centimetres. Use a flexible tape measure for accuracy."}
        </p>
      </div>

      {isPhysical ? (
        <div className="info-box blue" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="font-semibold mb-1">Studio fitting confirmed</p>
            <p>
              Your measurements will be taken professionally at the studio on your appointment date. No action needed here — just continue.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="field-row-2">
            {fields.map((field) => (
              <div className="booking-field" key={field.id}>
                <label htmlFor={`meas-${field.id}`}>{field.label}</label>
                <input
                  id={`meas-${field.id}`}
                  type="number"
                  min="0"
                  placeholder={field.placeholder}
                  value={formData.measurements?.[field.id] || ""}
                  onChange={(e) => updateMeasurements({ [field.id]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="booking-field mt-4">
            <label htmlFor="meas-notes">Additional notes (optional)</label>
            <textarea
              id="meas-notes"
              placeholder="e.g. I prefer a relaxed fit around the shoulders, longer hem length..."
              rows={3}
              value={formData.measurements?.notes || ""}
              onChange={(e) => updateMeasurements({ notes: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to outfit style">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button className="btn-continue" onClick={nextStep} aria-label="Continue to save progress">
          Continue
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"

const times = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
]

const today = new Date().toISOString().split("T")[0]

const alterationTypes = [
  { id: "resize",      label: "Resizing",     desc: "Make the garment larger or smaller" },
  { id: "hemming",     label: "Hemming",      desc: "Adjust the length of trousers, sleeves, or hems" },
  { id: "repair",      label: "Repair",       desc: "Fix tears, seams, zips, or buttons" },
  { id: "restructure", label: "Restructure",  desc: "Change the fit, shape, or silhouette" },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function StepTwoAlteration({
  formData, updateFormData, nextStep, prevStep, currentStep, totalSteps,
}) {
  const [errors, setErrors] = useState({})
  const selectedType = formData.alterationType || ""

  const validate = () => {
    const e = {}
    if (!formData.appointmentDate) e.date = "Please select a date."
    if (!formData.appointmentTime) e.time = "Please select a time."
    if (!selectedType) e.type = "Please select the type of alteration."
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
        <h2 className="step-title">Alteration details</h2>
        <p className="step-sub">
          Tell us what needs altering and when you would like to bring it in.
        </p>
      </div>

      {/* Alteration type */}
      <div className="booking-field mb-5">
        <label>What needs altering? <span className="text-error">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2" role="radiogroup">
          {alterationTypes.map((type) => {
            const isSelected = selectedType === type.id
            return (
              <div
                key={type.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`option-card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  updateFormData({ alterationType: type.id })
                  setErrors(prev => ({ ...prev, type: "" }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    updateFormData({ alterationType: type.id })
                    setErrors(prev => ({ ...prev, type: "" }))
                  }
                }}
              >
                <div className="flex-1">
                  <div className="text-[.9375rem] font-semibold text-text-primary mb-0.5">
                    {type.label}
                  </div>
                  <div className="text-[.8rem] text-text-secondary">{type.desc}</div>
                </div>
                <div className="option-card-check">
                  {isSelected && <CheckIcon />}
                </div>
              </div>
            )
          })}
        </div>
        {errors.type && <span className="text-[.8rem] text-error mt-1">{errors.type}</span>}
      </div>

      {/* Date and time */}
      <div className="field-row-2 mb-5">
        <div className="booking-field">
          <label htmlFor="alt-date">Drop-off date <span className="text-error">*</span></label>
          <input
            id="alt-date"
            type="date"
            min={today}
            value={formData.appointmentDate || ""}
            onChange={(e) => {
              updateFormData({ appointmentDate: e.target.value })
              setErrors(prev => ({ ...prev, date: "" }))
            }}
            style={{ borderColor: errors.date ? "#DC2626" : undefined }}
          />
          {errors.date && <span className="text-[.8rem] text-error mt-1">{errors.date}</span>}
        </div>
        <div className="booking-field">
          <label htmlFor="alt-time">Drop-off time <span className="text-error">*</span></label>
          <select
            id="alt-time"
            value={formData.appointmentTime || ""}
            onChange={(e) => {
              updateFormData({ appointmentTime: e.target.value })
              setErrors(prev => ({ ...prev, time: "" }))
            }}
            style={{ borderColor: errors.time ? "#DC2626" : undefined }}
          >
            <option value="">Select a time</option>
            {times.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.time && <span className="text-[.8rem] text-error mt-1">{errors.time}</span>}
        </div>
      </div>

      {/* Alteration description */}
      <div className="booking-field">
        <label htmlFor="alt-notes">Describe the alteration (optional)</label>
        <textarea
          id="alt-notes"
          placeholder="e.g. The trousers are too long, need to be shortened by about 3 inches..."
          rows={3}
          value={formData.alterationDetails || ""}
          onChange={(e) => updateFormData({ alterationDetails: e.target.value })}
        />
      </div>

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
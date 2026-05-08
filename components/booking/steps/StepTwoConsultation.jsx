"use client"

import { useState } from "react"

const times = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
]

const today = new Date().toISOString().split("T")[0]

const formatOptions = [
  {
    id: "in_person",
    name: "In-person session",
    desc: "Visit the studio for a 60-minute face-to-face consultation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: "online",
    name: "Online session",
    desc: "A 60-minute video call — no travel required",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function StepTwoConsultation({
  formData, updateFormData, nextStep, prevStep, currentStep, totalSteps,
}) {
  const [errors, setErrors] = useState({})
  const selected = formData.consultationFormat || ""

  const validate = () => {
    const e = {}
    if (!formData.appointmentDate) e.date = "Please select a date."
    if (!formData.appointmentTime) e.time = "Please select a time."
    if (!selected) e.format = "Please choose a session format."
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
        <h2 className="step-title">Session details</h2>
        <p className="step-sub">
          Choose your session format and preferred date and time.
        </p>
      </div>

      {/* Session format */}
      <div className="booking-field mb-5">
        <label>Session format <span className="text-error">*</span></label>
        <div className="flex flex-col gap-2.5 mt-2" role="radiogroup">
          {formatOptions.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <div
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`option-card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  updateFormData({ consultationFormat: opt.id })
                  setErrors(prev => ({ ...prev, format: "" }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    updateFormData({ consultationFormat: opt.id })
                    setErrors(prev => ({ ...prev, format: "" }))
                  }
                }}
              >
                <div className="option-icon">{opt.icon}</div>
                <div className="flex-1">
                  <div className="text-[.9375rem] font-semibold text-text-primary mb-0.5">{opt.name}</div>
                  <div className="text-[.8rem] text-text-secondary">{opt.desc}</div>
                </div>
                <div className="option-card-check">
                  {isSelected && <CheckIcon />}
                </div>
              </div>
            )
          })}
        </div>
        {errors.format && <span className="text-[.8rem] text-error mt-1">{errors.format}</span>}
      </div>

      {/* Date and time */}
      <div className="field-row-2">
        <div className="booking-field">
          <label htmlFor="con-date">Preferred date <span className="text-error">*</span></label>
          <input
            id="con-date"
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
          <label htmlFor="con-time">Preferred time <span className="text-error">*</span></label>
          <select
            id="con-time"
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

      {/* Topics */}
      <div className="booking-field mt-4">
        <label htmlFor="con-topics">What would you like to discuss? (optional)</label>
        <textarea
          id="con-topics"
          placeholder="e.g. I need help choosing outfits for my wedding events, building a work wardrobe..."
          rows={3}
          value={formData.consultationTopics || ""}
          onChange={(e) => updateFormData({ consultationTopics: e.target.value })}
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
"use client"

import { useState } from "react"
import { useAnalytics } from "@/hooks/useAnalytics"

const times = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
]

const measurementOptions = [
  {
    id: "physical",
    name: "Come in for fitting",
    desc: "Visit the studio on your appointment day, measurements taken professionally",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "self",
    name: "Submit measurements remotely",
    desc: "Fill in your measurements yourself, no visit required",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const today = new Date().toISOString().split("T")[0]

export default function StepTwo({
  formData, updateFormData, nextStep, prevStep, currentStep, totalSteps, anonymousSessionId
}) {

  const { trackCompleted } = useAnalytics({
    step: currentStep,
    anonymousSessionId,
    email: formData.email,
  })

  const [errors, setErrors] = useState({})
  const selected = formData.measurementType || ""

  const validate = () => {
    const e = {}
    if (!formData.appointmentDate) e.date = "Please select a date."
    if (!formData.appointmentTime) e.time = "Please select a time."
    if (!selected) e.measurement = "Please choose a measurement method."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    trackCompleted()

    if (validate()) nextStep()
  }

  return (
    <div className="booking-card">
      <div className="mb-7">
        <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
        <h2 className="step-title">Date and appointment</h2>
        <p className="step-sub">
          Choose your appointment date and how you prefer to handle measurements.
        </p>
      </div>

      {/* Date and time */}
      <div className="field-row-2 mb-5">
        <div className="booking-field">
          <label htmlFor="appt-date">Preferred date <span className="text-error">*</span></label>
          <input
            id="appt-date"
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
          <label htmlFor="appt-time">Preferred time <span className="text-error">*</span></label>
          <select
            id="appt-time"
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

      {/* Measurement method */}
      <div className="booking-field">
        <label>Measurement method <span className="text-error">*</span></label>
        <div className="flex flex-col gap-2.5 mt-2" role="radiogroup" aria-label="Measurement method">
          {measurementOptions.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <div
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`option-card ${isSelected ? "selected" : ""}`}
                style={{ borderColor: errors.measurement && !isSelected ? "#DC2626" : undefined }}
                onClick={() => {
                  updateFormData({ measurementType: opt.id })
                  setErrors(prev => ({ ...prev, measurement: "" }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    updateFormData({ measurementType: opt.id })
                    setErrors(prev => ({ ...prev, measurement: "" }))
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
        {errors.measurement && (
          <span className="text-[.8rem] text-error mt-1">{errors.measurement}</span>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to service selection">
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
"use client"

const STEPS = [
  "Service",
  "Date & Time",
  "Style",
  "Measurements",
  "Save Progress",
  "Your Details",
  "Review & Pay",
]

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function ProgressBar({ currentStep }) {
  return (
    <div className="progress-bar-wrap" role="navigation" aria-label="Booking progress">
      <div className="progress-track">
        {STEPS.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = stepNum === STEPS.length

          return (
            <div
              key={label}
              className="flex items-center"
              style={{ flex: isLast ? "0 0 auto" : 1 }}
            >
              <div
                className={`p-dot ${isDone ? "done" : isActive ? "active" : "upcoming"}`}
                aria-label={`Step ${stepNum}: ${label} — ${isDone ? "completed" : isActive ? "current" : "upcoming"}`}
              >
                {isDone ? <CheckIcon /> : stepNum}
              </div>
              {!isLast && (
                <div
                  className={`p-line ${isDone ? "done" : "upcoming"}`}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="p-labels" aria-hidden="true">
        {STEPS.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          return (
            <span
              key={label}
              className={`p-label ${isDone ? "done" : isActive ? "active" : ""}`}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
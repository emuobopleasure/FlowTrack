"use client"

const STEP_LABELS = {
  service:                  "Service",
  date:                     "Time",
  date_alteration:          "Details",
  date_consultation:        "Format",
  style:                    "Style",
  measurements:             "Measures",
  measurements_alteration:  "Measures",
  email:                    "Save",
  details:                  "Details",
  review:                   "Pay",
}

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function ProgressBar({ currentStep, totalSteps, flow }) {
  // Use the flow from props to get labels, fallback to a generic name if missing
  const labels = flow?.map(key => STEP_LABELS[key] || key) || []

  return (
    <div className="w-full" role="navigation" aria-label="Booking progress">
      {/* Dots and lines */}
      <div className="flex items-center justify-between">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = i === labels.length - 1

          return (
            <div key={label + i} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
              {/* Dot */}
              <div
                className={`p-dot !w-6 !h-6 !text-[10px] ${isDone ? "done" : isActive ? "active" : "upcoming"}`}
              >
                {isDone ? <CheckIcon /> : stepNum}
              </div>

              {/* Line */}
              {!isLast && (
                <div className={`p-line mx-2 ${isDone ? "done" : "upcoming"}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Labels - only visible on larger screens */}
      <div className="hidden lg:flex justify-between mt-2 px-1">
        {labels.map((label, i) => (
          <span 
            key={label + i} 
            className={`text-[11px] font-bold uppercase tracking-tight ${i + 1 <= currentStep ? "text-navy" : "text-slate-400"}`}
            style={{ width: '40px', textAlign: 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
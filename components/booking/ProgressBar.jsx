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
      {/* Unified Progress Track Row */}
      <div className="flex items-start justify-between relative w-full">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = i === labels.length - 1

          return (
            <div 
              key={label + i} 
              className={`flex flex-col items-center relative ${!isLast ? "flex-1" : "flex-grow-0"}`}
            >
              {/* Connector Line — Absolute positioning keeps it from pushing text or dots off-center */}
              {!isLast && (
                <div 
                  className={`p-line absolute h-[2px] top-3 left-[calc(50%+12px)] right-[calc(-50%+12px)] z-0 ${
                    isDone ? "done" : "upcoming"
                  }`} 
                />
              )}

              {/* Step Dot Circle Indicator */}
              <div
                className={`p-dot !w-6 !h-6 !text-[10px] flex items-center justify-center relative z-10 shrink-0 ${
                  isDone ? "done" : isActive ? "active" : "upcoming"
                }`}
              >
                {isDone ? <CheckIcon /> : stepNum}
              </div>

              {/* Label Component — Centered, matching typography, visible across tablet & desktop */}
              <span 
                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-tight mt-2 text-center whitespace-nowrap px-1 z-10 block transition-colors duration-200 ${
                  stepNum <= currentStep ? "text-navy" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
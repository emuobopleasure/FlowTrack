"use client"

const STEPS = [
  "Service",
  "Time",
  "Style",
  "Measures",
  "Save",
  "Details",
  "Pay",
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full" role="navigation" aria-label="Booking progress">
      {/* Dots and lines */}
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = i === STEPS.length - 1

          return (
            <div key={label} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
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

      {/* Labels - only visible on larger screens to prevent crowding */}
      <div className="hidden lg:flex justify-between mt-2">
        {STEPS.map((label, i) => (
          <span 
            key={label} 
            className={`text-[12px] font-semibold ${i + 1 <= currentStep ? "text-navy" : "text-slate-400"}`}
            style={{ width: '30px', textAlign: 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
"use client"

const services = [
  {
    id: "custom_outfit",
    name: "Custom Outfit",
    desc: "Original piece built to your measurements, agbada, senator, kaftan and more",
    // badge: "Most booked",
    featured: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    id: "alteration",
    name: "Alteration",
    desc: "Expert adjustments to an existing garment, resizing, hemming, restructuring",
    badge: null,
    featured: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    id: "consultation",
    name: "Styling Consultation",
    desc: "60-minute session to plan your style, wardrobe, or event outfits",
    badge: null,
    featured: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function StepOne({ formData, updateFormData, nextStep }) {
  const selected = formData.service || "custom_outfit"

  return (
    <div className="booking-card">

      <div className="mb-7">
        <div className="step-eyebrow">Step 1 of 7</div>
        <h2 className="step-title">What do you need?</h2>
        <p className="step-sub">
          Choose the service that fits your situation. You can update this anytime before paying.
        </p>
      </div>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Service selection">
        {services.map((svc) => {
          const isSelected = selected === svc.id
          return (
            <div
              key={svc.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`option-card ${isSelected ? "selected" : ""} ${svc.featured ? "py-5" : "py-3.5"}`}
              onClick={() => updateFormData({ service: svc.id })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  updateFormData({ service: svc.id })
                }
              }}
            >
              <div className="option-icon">{svc.icon}</div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5 min-w-0">
                  <span className={`font-semibold text-text-primary ${svc.featured ? "text-base" : "text-[.9375rem]"}`}>
                    {svc.name}
                  </span>
                  {svc.badge && (
                    <span className="text-[.65rem] font-semibold px-2 py-0.5 rounded-full bg-navy text-white tracking-[.04em]">
                      {svc.badge}
                    </span>
                  )}
                </div>
                <p className="text-[.8125rem] text-text-secondary leading-snug">
                  {svc.desc}
                </p>
              </div>

              <div className="option-card-check">
                {isSelected && <CheckIcon />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="step-actions">
        <div />
        <button
          className="btn-continue"
          onClick={nextStep}
          aria-label="Continue to date and time selection"
        >
          Continue
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
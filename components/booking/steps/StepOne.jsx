"use client"

/**
 * StepOne — Service Selection
 *
 * Three services available. Custom Outfit is pre-selected
 * and visually dominant based on real booking data —
 * 100% of bookings are for custom outfits.
 *
 * User can still switch to Alteration or Consultation.
 */

const services = [
  {
    id: "custom_outfit",
    name: "Custom Outfit",
    desc: "Original piece built to your measurements — agbada, senator, kaftan and more",
    badge: "Most booked",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    id: "alteration",
    name: "Alteration",
    desc: "Expert adjustments to an existing garment — resizing, hemming, restructuring",
    badge: null,
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
  // Default to custom_outfit if nothing selected yet
  const selected = formData.service || "custom_outfit"

  const handleSelect = (id) => {
    updateFormData({ service: id })
  }

  return (
    <div className="booking-card">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div className="step-eyebrow">Step 1 of 7</div>
        <div className="step-title">What do you need?</div>
        <div className="step-sub">
          Choose the service that fits your situation. You can update this anytime before paying.
        </div>
      </div>

      {/* Service options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {services.map((svc) => {
          const isSelected = selected === svc.id
          return (
            <div
              key={svc.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`option-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelect(svc.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSelect(svc.id)
                }
              }}
              style={{
                // Custom outfit card is larger and more prominent
                padding: svc.id === "custom_outfit" ? "20px 18px" : "14px 18px",
              }}
            >
              <div className="option-icon">
                {svc.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "3px",
                }}>
                  <span style={{
                    fontSize: svc.id === "custom_outfit" ? "1rem" : ".9375rem",
                    fontWeight: "600",
                    color: "#0D1B2A",
                  }}>
                    {svc.name}
                  </span>
                  {svc.badge && (
                    <span style={{
                      fontSize: ".65rem",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: "#1B3A6B",
                      color: "#fff",
                      letterSpacing: ".04em",
                    }}>
                      {svc.badge}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: ".8125rem",
                  color: "#64748B",
                  lineHeight: "1.5",
                }}>
                  {svc.desc}
                </div>
              </div>

              <div className="option-card-check">
                {isSelected && <CheckIcon />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
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
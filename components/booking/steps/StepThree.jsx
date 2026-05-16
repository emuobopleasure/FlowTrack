"use client"

import { useState } from "react"

const outfits = [
  {
    id: "agbada",
    name: "Agbada",
    type: "Traditional · Formal",
    desc: "Wide flowing robes crafted for weddings, ceremonies, and high-profile events. Comes with inner wear and cap.",
    image: "agbada-outfit.jpg",
  },
  {
    id: "senator",
    name: "Senator Suit",
    type: "Smart Casual · Event",
    desc: "A tailored two-piece native suit. Office-ready Nigerian style that works for any occasion from boardrooms to events.",
    image: "senator-outfit.jpg",
  },
  {
    id: "kaftan",
    name: "Kaftan",
    type: "Casual · Relaxed",
    desc: "Comfortable everyday wear with a clean, modern cut. Perfect for casual outings, lounging, or low-key events.",
    image: "kaftan-outfit.jpg",
  },
  {
    id: "ankara_shirt",
    name: "Ankara Shirt",
    type: "Smart Casual",
    desc: "Vibrant Ankara prints cut into a crisp modern shirt. Pairs with trousers or jeans for a sharp casual look.",
    image: "ankara-outfit.jpg",
  },
  {
    id: "babariga",
    name: "Babariga",
    type: "Traditional · Formal",
    desc: "Full traditional regalia with wide, embroidered sleeves. A statement piece for important ceremonies.",
    image: "babariga-outfit.jpg",
  },
  {
    id: "aso_oke",
    name: "Aso-Oke Set",
    type: "Ceremonial",
    desc: "Full ceremonial aso-oke regalia for weddings and traditional occasions. Available in hand-woven fabric.",
    image: "aso-oke-outfit.jpg",
  },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function StepThree({
  formData, updateFormData, nextStep, prevStep, currentStep, totalSteps,
}) {
  const [view, setView] = useState("grid")
  const selected = formData.outfitStyle || ""

  const handleSelect = (id) => updateFormData({ outfitStyle: id })

  return (
    <div className="booking-card" style={{ maxWidth: "780px" }}>
      <div className="mb-6">
        <div className="step-eyebrow">Step {currentStep} of {totalSteps}</div>
        <h2 className="step-title">Choose your style</h2>
        <p className="step-sub">
          Pick the outfit style you want. You can describe your preferences in detail in the next steps.
        </p>
      </div>

      {/* Toolbar */}
      <div className="outfit-toolbar">
        <span className="text-[.8125rem] text-text-muted font-medium">
          {outfits.length} styles available
        </span>
        <div className="view-toggle" role="group" aria-label="Toggle view">
          <button
            className={`view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="outfit-grid" role="radiogroup" aria-label="Outfit styles">
          {outfits.map((outfit) => {
            const isSelected = selected === outfit.id
            return (
              <div
                key={outfit.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`outfit-grid-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(outfit.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect(outfit.id)
                  }
                }}
                aria-label={`${outfit.name} — ${outfit.type}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  className="outfit-grid-img"
                  loading="lazy"
                />
                <div className="outfit-grid-label">
                  <div className="outfit-grid-name">{outfit.name}</div>
                  <div className="outfit-grid-type">{outfit.type}</div>
                </div>
                <div className="outfit-selected-check" aria-hidden="true">
                  <CheckIcon />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view — big scrollable cards */}
      {view === "list" && (
        <div
          className="flex flex-col gap-4"
          role="radiogroup"
          aria-label="Outfit styles"
        >
          {outfits.map((outfit) => {
            const isSelected = selected === outfit.id
            return (
              <div
                key={outfit.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={[
                  "flex flex-col sm:flex-row rounded-2xl overflow-hidden border-2 cursor-pointer",
                  "transition-all duration-200",
                  isSelected
                    ? "border-navy shadow-[0_0_0_3px_rgba(27,58,107,.12)]"
                    : "border-border-light hover:border-navy",
                ].join(" ")}
                onClick={() => handleSelect(outfit.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect(outfit.id)
                  }
                }}
                aria-label={`${outfit.name} — ${outfit.type}`}
                style={{
                  background: isSelected ? "#EEF3FB" : "#fff",
                  transform: isSelected ? "translateY(-2px)" : undefined,
                }}
              >
                {/* Image — full width on mobile, fixed width on desktop */}
                <div className="w-full sm:w-[160px] h-[220px] sm:h-auto shrink-0 overflow-hidden bg-[#EEF3FB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500"
                    style={{ transform: isSelected ? "scale(1.03)" : "scale(1)" }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-5 gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.125rem] font-bold text-text-primary tracking-tight">
                          {outfit.name}
                        </h3>
                        <span className="text-[.75rem] font-medium text-navy mt-0.5 block">
                          {outfit.type}
                        </span>
                      </div>
                      {/* Check indicator */}
                      <div
                        className={[
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                          "transition-all duration-200",
                          isSelected
                            ? "bg-navy border-navy"
                            : "border-border bg-white",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {isSelected && <CheckIcon />}
                      </div>
                    </div>

                    <p className="text-[.875rem] text-text-secondary leading-relaxed mt-3">
                      {outfit.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2 text-[.8125rem] font-semibold text-navy">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button
          className="btn-continue"
          onClick={nextStep}
          disabled={!selected}
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
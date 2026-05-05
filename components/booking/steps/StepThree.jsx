"use client"

import { useState } from "react"

const outfits = [
  {
    id: "agbada",
    name: "Agbada",
    type: "Traditional · Formal",
    desc: "Wide flowing robes — weddings, ceremonies, and high-profile events",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=533&fit=crop&q=80",
  },
  {
    id: "senator",
    name: "Senator Suit",
    type: "Smart Casual · Event",
    desc: "Two-piece native suit — office-ready Nigerian style for any occasion",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=533&fit=crop&q=80",
  },
  {
    id: "kaftan",
    name: "Kaftan",
    type: "Casual · Relaxed",
    desc: "Comfortable everyday style — relaxed fit with a clean, modern cut",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=533&fit=crop&q=80",
  },
  {
    id: "ankara_shirt",
    name: "Ankara Shirt",
    type: "Smart Casual",
    desc: "Vibrant Ankara prints tailored into a crisp modern shirt",
    image: "https://images.unsplash.com/photo-1631125915902-d5c3380ecfb3?w=400&h=533&fit=crop&q=80",
  },
  {
    id: "babariga",
    name: "Babariga",
    type: "Traditional · Formal",
    desc: "Full traditional regalia with wide embroidered sleeves",
    image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=400&h=533&fit=crop&q=80",
  },
  {
    id: "aso_oke",
    name: "Aso-Oke Set",
    type: "Ceremonial",
    desc: "Full ceremonial aso-oke for weddings and traditional occasions",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=533&fit=crop&q=80",
  },
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function StepThree({ formData, updateFormData, nextStep, prevStep }) {
  const [view, setView] = useState("grid")
  const selected = formData.outfitStyle || ""

  const handleSelect = (id) => updateFormData({ outfitStyle: id })

  return (
    <div className="booking-card max-w-[780px]">

      <div className="mb-6">
        <div className="step-eyebrow">Step 3 of 7</div>
        <h2 className="step-title">Choose your style</h2>
        <p className="step-sub">
          Pick the outfit style you want. You can describe your preferences in the next steps.
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

      {/* List view */}
      {view === "list" && (
        <div className="outfit-list" role="radiogroup" aria-label="Outfit styles">
          {outfits.map((outfit) => {
            const isSelected = selected === outfit.id
            return (
              <div
                key={outfit.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`outfit-list-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(outfit.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect(outfit.id)
                  }
                }}
                aria-label={`${outfit.name} — ${outfit.type}`}
              >
                <div className="outfit-list-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={outfit.image} alt={outfit.name} loading="lazy" />
                </div>
                <div className="flex-1">
                  <div className="outfit-list-name">{outfit.name}</div>
                  <div className="outfit-list-desc">{outfit.desc}</div>
                </div>
                <div className="outfit-list-check" aria-hidden="true">
                  {isSelected && <CheckIcon />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="step-actions">
        <button className="btn-back" onClick={prevStep} aria-label="Go back to date and time">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <button
          className="btn-continue"
          onClick={nextStep}
          disabled={!selected}
          aria-label="Continue to measurements"
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
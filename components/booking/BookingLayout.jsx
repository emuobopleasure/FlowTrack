"use client"

import { useState } from "react"
import ProgressBar from "./ProgressBar"
import ExitModal from "./ExitModal"

export default function BookingLayout({ currentStep, children }) {
  const [exitOpen, setExitOpen] = useState(false)

  return (
    <>
      <ExitModal isOpen={exitOpen} onClose={() => setExitOpen(false)} />

      <ProgressBar currentStep={currentStep} />

      {/* Exit button — overlaid on the fixed navbar */}
      <div className="fixed top-0 right-6 md:right-10 h-16 flex items-center z-[101]">
        <button
          className="exit-booking-btn"
          onClick={() => setExitOpen(true)}
          aria-label="Exit booking flow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Exit booking
        </button>
      </div>

      {/* Page body */}
      <div className="min-h-screen bg-off-white pt-[140px] pb-12 flex items-start justify-center px-5">
        <div className="w-full max-w-[680px]">
          {children}
        </div>
      </div>
    </>
  )
}
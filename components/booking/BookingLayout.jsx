"use client"

import { useState } from "react"
import Link from "next/link"
import ProgressBar from "./ProgressBar"
import ExitModal from "./ExitModal"

export default function BookingLayout({ currentStep, children }) {
  const [exitOpen, setExitOpen] = useState(false)

  return (
    <>
      {/* Exit modal */}
      <ExitModal isOpen={exitOpen} onClose={() => setExitOpen(false)} />

      {/* Progress bar — sits below the fixed navbar */}
      <ProgressBar currentStep={currentStep} />

      {/* Page body */}
      <div
        style={{
          paddingTop: "140px",
          paddingBottom: "48px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#F5F5F0",
        }}
      >
        <div style={{ width: "100%", maxWidth: "680px", padding: "0 20px" }}>
          {children}
        </div>
      </div>

      {/* Exit button — injected into the navbar via a portal-like pattern.
          We add it as a fixed element that aligns with the navbar. */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: "40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          zIndex: 101,
        }}
      >
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
    </>
  )
}
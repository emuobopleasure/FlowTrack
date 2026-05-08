"use client"

import { useState } from "react"
import ProgressBar from "./ProgressBar"
import ExitModal from "./ExitModal"

export default function BookingLayout({ currentStep, totalSteps, flow, children }) {
  const [exitOpen, setExitOpen] = useState(false)

  return (
    <div className="min-h-screen bg-off-white font-sans">
      <ExitModal isOpen={exitOpen} onClose={() => setExitOpen(false)} />

      {/* Unified Header: Your exact layout structure */}
      <header className="fixed top-0 left-0 right-0 z-[101] bg-white border-b border-border-light shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between">
          
          {/* Left: Branding / Context */}
          <div className="flex flex-col">
             <span className="text-[12px] uppercase tracking-widest text-navy font-bold md:hidden">
                Step {currentStep} of {totalSteps}
             </span>
             <span className="hidden md:block font-bold text-navy tracking-tight">
                FlowTrack Booking
             </span>
          </div>

          {/* Middle: Progress Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} flow={flow} />
          </div>

          {/* Right: Exit Button */}
          <button 
            className="exit-booking-btn !py-2 !px-4 text-xs md:text-sm flex items-center" 
            onClick={() => setExitOpen(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="md:mr-2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Exit booking</span>
          </button>
        </div>

        {/* Mobile-only thin progress strip */}
        <div className="md:hidden w-full h-1 bg-slate-100">
            <div 
                className="h-full bg-navy transition-all duration-500 ease-out" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 md:pt-32 pb-12 px-5 flex justify-center animate-fade-in">
        <div className="w-full max-w-[680px]">
          {children}
        </div>
      </main>
    </div>
  )
}
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ExitModal({ isOpen, onClose }) {
  const router = useRouter()

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    if (isOpen) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(13,27,42,.5)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        <div className="modal-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="modal-title" id="exit-modal-title">Exit booking?</div>
        <div className="modal-body">
          Your progress is saved automatically. Come back anytime and enter your email to continue from where you left off.
        </div>
        <div className="modal-actions">
          <button className="modal-stay" onClick={onClose}>
            Stay and continue
          </button>
          <button className="modal-leave" onClick={() => router.push("/")}>
            Yes, exit
          </button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResumePage() {
  const router = useRouter()

  const [email, setEmail]     = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  

  const handleResume = async (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)

    try {
      const res  = await fetch("/api/session/resume", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.toLowerCase().trim() }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || "No saved booking found for this email address.")
        return
      }

      // Store the restored session in sessionStorage
      // so the booking page can pick it up on mount
      sessionStorage.setItem(
        "flowtrack_resume",
        JSON.stringify({
          currentStep:        data.session.currentStep,
          formData:           data.session.formData,
          anonymousSessionId: data.session.anonymousSessionId,
        })
      )

      // Go to the booking page — it will restore state on mount
      router.push("/book")

    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-off-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] border border-border-light shadow-[0_4px_24px_rgba(0,0,0,.06)] p-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline mb-8">
          <div className="w-[30px] h-[30px] rounded-lg bg-navy flex items-center justify-center" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="text-[.9375rem] font-bold text-navy tracking-tight">FlowTrack</span>
        </Link>

        <div className="mb-7">
          <h1 className="text-[1.5rem] font-bold text-text-primary tracking-tight mb-2">
            Continue your booking
          </h1>
          <p className="text-[.9375rem] text-text-secondary leading-relaxed">
            Enter the email you used when you started your booking and we will take you back to where you left off.
          </p>
        </div>

        <form onSubmit={handleResume} noValidate className="flex flex-col gap-4">
          <div className="booking-field">
            <label htmlFor="resume-email">Email address</label>
            <input
              id="resume-email"
              type="email"
              placeholder="james@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              autoComplete="email"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-error text-[.8125rem]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-continue w-full justify-center mt-1"
            disabled={loading}
          >
            {loading ? "Finding your booking..." : "Continue booking"}
            {!loading && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </form>

        <p className="text-[.8rem] text-text-muted text-center mt-5 leading-relaxed">
          Starting fresh?{" "}
          <Link href="/book" className="text-navy font-semibold no-underline">
            Start a new booking →
          </Link>
        </p>
      </div>
    </main>
  )
}
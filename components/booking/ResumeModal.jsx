"use client"

import { useState, useEffect } from "react"

export default function ResumeModal({ onResume, onDismiss }) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false)

    // Delay before the modal appears
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
    }, [])

    const handleResume = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim()) {
            setError("Please enter your email address.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/session/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            })
            const data = await res.json()

            if (!data.success) {
                setError("No saved booking found for this email.")
                return
            }

            onResume(data.session)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Don't render anything until the delay has passed
    if (!visible) return null

    return (
        <>
            {/* Backdrop — fades in */}
            <div
                className="fixed inset-0 z-[150] bg-[rgba(13,27,42,.4)] backdrop-blur-sm"
                style={{
                    animation: "fadeIn 400ms ease both",
                }}
                onClick={onDismiss}
                aria-hidden="true"
            />

            {/* Absolute Centered Modal Wrapper — Safe for ultra-short heights */}
            <div
                className="fixed inset-0 z-[151] overflow-y-auto pointer-events-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-modal-title"
            >
                {/* Modal Card Body */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-white rounded-[20px] border border-border-light shadow-[0_20px_60px_rgba(0,0,0,.15)] p-5 sm:p-8 pointer-events-auto max-h-[calc(100vh-2rem)] flex flex-col [@media(max-height:440px)]:p-4 [@media(max-height:440px)]:rounded-[12px]"
                    style={{
                        animation: "slideDown 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
                    }}
                >
                    {/* Inner Scrollable Container — forces text to stay scrollable on landscape */}
                    <div className="overflow-y-auto w-full pr-1 flex flex-col gap-4 [@media(max-height:440px)]:gap-2">
                        {/* Icon + header */}
                        <div className="flex items-start gap-4 [@media(max-height:440px)]:gap-2">
                            <div className="flex-1">
                                <h2
                                    id="resume-modal-title"
                                    className="text-[1.0625rem] font-bold text-text-primary tracking-tight [@media(max-height:440px)]:text-[0.95rem]"
                                >
                                    Continue your last booking?
                                </h2>
                                <p className="text-[.8125rem] text-text-secondary leading-relaxed mt-1 [@media(max-height:440px)]:hidden">
                                    Enter the email you used before and we will restore your progress.
                                </p>
                            </div>
                            <button
                                onClick={onDismiss}
                                className="text-text-muted hover:text-text-secondary transition-colors mt-0.5 shrink-0 cursor-pointer"
                                aria-label="Dismiss and start fresh"
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleResume} noValidate className="flex flex-col gap-3 [@media(max-height:440px)]:gap-2">
                            <div className="booking-field">
                                <label htmlFor="resume-email" className="[@media(max-height:440px)]:text-[0.75rem]">Email address</label>
                                <input
                                    id="resume-email"
                                    type="email"
                                    placeholder="james@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError("") }}
                                    autoComplete="email"
                                    required
                                    className="[@media(max-height:440px)]:py-2 [@media(max-height:440px)]:text-[0.8125rem]"
                                />
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-error text-[.8125rem] [@media(max-height:440px)]:py-1.5 [@media(max-height:440px)]:text-[0.75rem]"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Identical Button Action Layout Block */}
                            <div className="grid grid-cols-2 gap-3 mt-1 w-full">
                                <button
                                    type="button"
                                    onClick={onDismiss}
                                    className="w-full flex items-center justify-center px-3 py-2.5 sm:py-3 rounded-full border border-border-light text-[.8125rem] sm:text-[.875rem] font-semibold text-text-secondary bg-transparent hover:border-navy hover:text-navy transition-all duration-200 whitespace-nowrap [@media(max-height:440px)]:py-2"
                                >
                                    Start fresh
                                </button>
                                <button
                                    type="submit"
                                    className="btn-continue w-full flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 text-[.8125rem] sm:text-[.875rem] whitespace-nowrap [@media(max-height:440px)]:py-2"
                                    disabled={loading}
                                >
                                    <span className="truncate">{loading ? "Restoring..." : "Resume booking"}</span>
                                    {!loading && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="shrink-0">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
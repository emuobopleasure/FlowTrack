"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Incorrect email or password.")
        return
      }

      router.push("/admin/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-off-white flex items-center justify-center px-5">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline mb-10 w-fit"
          aria-label="FlowTrack home"
        >
          <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-navy tracking-tight">
            FlowTrack
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[20px] border border-border-light shadow-[0_4px_24px_rgba(0,0,0,.06)] p-10">

          <div className="mb-8">
            <h1 className="text-[1.5rem] font-bold text-text-primary tracking-tight mb-2">
              Admin login
            </h1>
            <p className="text-[.9375rem] text-text-secondary leading-relaxed">
              Sign in to access your booking dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="booking-field">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                autoComplete="email"
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                autoComplete="current-password"
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
              aria-label="Sign in to admin dashboard"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[.8rem] text-text-muted mt-6">
          This page is for the designer only.{" "}
          <Link href="/" className="text-navy font-medium no-underline">
            Back to site →
          </Link>
        </p>
      </div>
    </main>
  )
}
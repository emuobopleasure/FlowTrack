import Link from "next/link"

export const metadata = {
  title: "Booking Confirmed — FlowTrack",
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-off-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[520px] bg-white rounded-[20px] border border-border-light shadow-[0_4px_24px_rgba(0,0,0,.06)] p-10 text-center">

        {/* Success icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight mb-2">
          Booking confirmed
        </h1>
        <p className="text-[.9375rem] text-text-secondary leading-[1.7] mb-8">
          Your payment was successful and your booking is confirmed. Check your email, we have sent you a full summary and a 6-digit verification code.
        </p>

        {/* Info boxes */}
        <div className="flex flex-col gap-3 mb-8 text-left">
          <div className="info-box blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <p className="font-semibold mb-0.5">Check your email</p>
              <p>Your booking summary and 6-digit verification code have been sent. Keep the code, you will need it to access your booking details anytime.</p>
            </div>
          </div>

          <div className="info-box green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="font-semibold mb-0.5">Your booking is secure</p>
              <p>All your details; measurements, style, date are saved on record. Visit the link below anytime to view or verify your booking.</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/booking/verify"
            className="hero-cta-primary justify-center"
            aria-label="View your booking details"
          >
            View my booking
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/"
            className="hero-cta-secondary justify-center"
            aria-label="Return to homepage"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
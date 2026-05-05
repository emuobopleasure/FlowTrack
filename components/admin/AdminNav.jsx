import Link from "next/link"
import { SignOutButton } from "./SignOutButton"

export default function AdminNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-border-light flex items-center justify-between px-6 md:px-10">

      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 no-underline group"
        aria-label="FlowTrack admin dashboard"
      >
        <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
            <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity=".6"/>
            <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity=".6"/>
            <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
          </svg>
        </div>
        <div>
          <span className="text-[.9375rem] font-bold text-navy tracking-tight">FlowTrack</span>
          <span className="ml-2 text-[.7rem] font-semibold text-text-muted uppercase tracking-[.08em]">Admin</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard"
          className="text-[.875rem] font-medium text-text-secondary no-underline hover:text-navy transition-colors hidden md:block"
        >
          Dashboard
        </Link>
        <SignOutButton />
      </div>
    </header>
  )
}
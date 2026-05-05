"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-[.8125rem] font-semibold text-text-secondary hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA]"
      style={{ transition: "color 200ms, background 200ms, border-color 200ms" }}
    >
      Sign out
    </button>
  )
}
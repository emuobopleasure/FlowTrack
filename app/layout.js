import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "FlowTrack — Nigerian Male Fashion Booking",
  description: "Book custom Nigerian male outfits, alterations, and styling consultations in minutes.",
}

export const viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
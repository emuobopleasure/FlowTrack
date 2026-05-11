import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"

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
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
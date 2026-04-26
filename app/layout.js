import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'FlowTrack — Fashion Booking Platform',
  description:
    'Book a custom outfit, alteration, or styling consultation with ease.',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
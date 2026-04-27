import './globals.css'

export const metadata = {
  title: 'FlowTrack — Nigerian Male Fashion Booking',
  description:
    'Book custom Nigerian male outfits, alterations, and styling consultations in minutes.',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
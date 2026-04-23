import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generates a random 6-digit OTP code
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP expires after 24 hours
// Returns the exact timestamp when the OTP becomes invalid
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

// Checks if an OTP has expired by comparing current time to expiry timestamp
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt)
}

// Sends the booking confirmation email containing the OTP and booking summary
export const sendConfirmationEmail = async ({ email, name, otp, bookingDetails }) => {
  const { service, appointmentDate, appointmentTime, measurementType } = bookingDetails

  await resend.emails.send({
    from: 'FlowTrack <bookings@yourdomain.com>',
    to: email,
    subject: 'Your booking is confirmed — FlowTrack',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>Booking confirmed, ${name}.</h2>

        <p>Here is a summary of your booking:</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666;">Service</td>
            <td style="padding: 8px 0;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Date</td>
            <td style="padding: 8px 0;">${appointmentDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Time</td>
            <td style="padding: 8px 0;">${appointmentTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Measurement</td>
            <td style="padding: 8px 0;">${measurementType === 'physical' ? 'Physical appointment' : 'Self-submitted'}</td>
          </tr>
        </table>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

        <p>To view your full booking details at any time, visit:</p>
        <p><strong>${process.env.NEXTAUTH_URL}/booking/verify</strong></p>

        <p>Your verification code:</p>
        <h1 style="letter-spacing: 8px; font-size: 36px;">${otp}</h1>
        <p style="color: #666; font-size: 14px;">This code expires in 24 hours.</p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">
          If you did not make this booking, you can ignore this email.
        </p>
      </div>
    `
  })
}
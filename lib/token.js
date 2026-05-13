import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateOTPExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt)
}

export const sendConfirmationEmail = async ({ email, name, otp, bookingDetails }) => {
  const { service, appointmentDate, appointmentTime, measurementType } = bookingDetails

  const serviceLabels = {
    custom_outfit: 'Custom Outfit',
    alteration:    'Alteration',
    consultation:  'Styling Consultation',
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const siteUrl     = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const { data, error } = await resend.emails.send({
    from:    `FlowTrack <${fromAddress}>`,
    to:      email,
    subject: 'Your booking is confirmed — FlowTrack',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Booking Confirmed</title>
      </head>
      <body style="margin:0;padding:0;background:#F5F5F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

          <!-- Header -->
          <div style="background:#1B3A6B;padding:32px 40px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                FlowTrack
              </span>
            </div>
          </div>

          <!-- Body -->
          <div style="padding:40px;">
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0D1B2A;letter-spacing:-0.02em;">
              Booking confirmed, ${name}.
            </h2>
            <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">
              Your payment was successful. Here is a summary of your booking.
            </p>

            <!-- Booking summary -->
            <table style="width:100%;border-collapse:collapse;border:1.5px solid #E2E8F0;border-radius:12px;overflow:hidden;">
              <tr style="background:#F5F5F0;">
                <td style="padding:12px 16px;font-size:13px;font-weight:500;color:#64748B;width:40%;">Service</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0D1B2A;">
                  ${serviceLabels[service] || service}
                </td>
              </tr>
              <tr style="border-top:1px solid #E2E8F0;">
                <td style="padding:12px 16px;font-size:13px;font-weight:500;color:#64748B;">Date</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0D1B2A;">${appointmentDate}</td>
              </tr>
              <tr style="border-top:1px solid #E2E8F0;background:#F5F5F0;">
                <td style="padding:12px 16px;font-size:13px;font-weight:500;color:#64748B;">Time</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0D1B2A;">${appointmentTime}</td>
              </tr>
              <tr style="border-top:1px solid #E2E8F0;">
                <td style="padding:12px 16px;font-size:13px;font-weight:500;color:#64748B;">Measurement</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0D1B2A;">
                  ${measurementType === 'physical' ? 'Come in for fitting' : 'Self-submitted'}
                </td>
              </tr>
            </table>

            <!-- OTP section -->
            <div style="margin:28px 0;padding:24px;background:#EEF3FB;border-radius:12px;text-align:center;border:1px solid rgba(27,58,107,.12);">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1B3A6B;text-transform:uppercase;letter-spacing:.08em;">
                Your verification code
              </p>
              <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1B3A6B;font-family:monospace;">
                ${otp}
              </div>
              <p style="margin:12px 0 0;font-size:12px;color:#64748B;">
                This code expires in 24 hours.
              </p>
            </div>

            <!-- CTA -->
            <p style="margin:0 0 16px;font-size:14px;color:#64748B;line-height:1.6;">
              Use this code to view your full booking details anytime at:
            </p>
            
              href="${siteUrl}/booking/verify"
              style="display:inline-block;padding:14px 28px;background:#1B3A6B;color:#ffffff;text-decoration:none;border-radius:9999px;font-size:14px;font-weight:600;"
            >
              View my booking →
            </a>
          </div>

          <!-- Footer -->
          <div style="padding:24px 40px;border-top:1px solid #E2E8F0;background:#F5F5F0;">
            <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
              If you did not make this booking, you can ignore this email. 
              For help, reply to this email or contact us directly.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  })

  if (error) {
    console.error('Resend email error:', error)
    throw new Error(`Email failed: ${error.message}`)
  }

  console.log('Confirmation email sent:', data?.id)
  return data
}
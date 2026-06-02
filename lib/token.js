import nodemailer from 'nodemailer'

// ── Transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})


// ── Helpers ───────────────────────────────────────────────
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateOTPExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt)
}

// ── Labels ────────────────────────────────────────────────
const SERVICE_LABELS = {
  custom_outfit: 'Custom Outfit',
  alteration: 'Alteration',
  consultation: 'Styling Consultation',
}

const OUTFIT_LABELS = {
  agbada: 'Agbada',
  senator: 'Senator Suit',
  kaftan: 'Kaftan',
  ankara_shirt: 'Ankara Shirt',
  babariga: 'Babariga',
  aso_oke: 'Aso-Oke Set',
}

const ALTERATION_LABELS = {
  resize: 'Resizing',
  hemming: 'Hemming',
  repair: 'Repair',
  restructure: 'Restructure',
}

const CONSULTATION_FORMAT_LABELS = {
  in_person: 'In-person session',
  online: 'Online session',
}

// ── Email ─────────────────────────────────────────────────
export const sendConfirmationEmail = async ({
  email,
  name,
  otp,
  bookingDetails,
}) => {
  const {
    service,
    outfitStyle,
    appointmentDate,
    appointmentTime,
    measurementType,
    alterationType,
    consultationFormat,
  } = bookingDetails

  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Build summary rows based on service
  const buildRows = () => {
    const rows = []

    rows.push({ label: 'Service', value: SERVICE_LABELS[service] || service })

    if (service === 'custom_outfit' && outfitStyle) {
      rows.push({ label: 'Style', value: OUTFIT_LABELS[outfitStyle] || outfitStyle })
    }
    if (service === 'alteration' && alterationType) {
      rows.push({ label: 'Alteration type', value: ALTERATION_LABELS[alterationType] || alterationType })
    }
    if (service === 'consultation' && consultationFormat) {
      rows.push({ label: 'Session format', value: CONSULTATION_FORMAT_LABELS[consultationFormat] || consultationFormat })
    }

    rows.push({ label: 'Date', value: appointmentDate })
    rows.push({ label: 'Time', value: appointmentTime })

    if (service === 'custom_outfit' && measurementType) {
      rows.push({
        label: 'Measurement',
        value: measurementType === 'physical' ? 'Come in for fitting' : 'Self-submitted',
      })
    }

    return rows
  }

  const tableRows = buildRows()
    .map((row, i) => `
      <tr style="background:${i % 2 === 0 ? '#F5F5F0' : '#ffffff'};">
        <td style="padding:12px 16px;font-size:13px;font-weight:500;color:#64748B;width:40%;border-top:${i > 0 ? '1px solid #E2E8F0' : 'none'};">
          ${row.label}
        </td>
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0D1B2A;border-top:${i > 0 ? '1px solid #E2E8F0' : 'none'};">
          ${row.value}
        </td>
      </tr>
    `)
    .join('')

  const html = `
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
        <div style="background:#1B3A6B;padding:28px 40px;">
          <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
            FlowTrack
          </span>
        </div>

        <!-- Body -->
        <div style="padding:36px 40px;">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0D1B2A;letter-spacing:-0.02em;">
            Booking confirmed, ${name}.
          </h2>
          <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">
            Your payment was successful. Here is a summary of your booking.
          </p>

          <!-- Booking summary -->
          <table style="width:100%;border-collapse:collapse;border:1.5px solid #E2E8F0;border-radius:12px;overflow:hidden;">
            ${tableRows}
          </table>

          <!-- OTP -->
          <div style="margin:28px 0;padding:24px;background:#EEF3FB;border-radius:12px;text-align:center;border:1px solid rgba(27,58,107,.12);">
            <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#1B3A6B;text-transform:uppercase;letter-spacing:.08em;">
              Your verification code
            </p>
            <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1B3A6B;font-family:monospace;">
              ${otp}
            </div>
            <p style="margin:12px 0 0;font-size:12px;color:#64748B;">
              Use this code to view your booking details. Expires in 24 hours.
            </p>
          </div>

          <!-- CTA -->
          <p style="margin:0 0 16px;font-size:14px;color:#64748B;line-height:1.6;">
  View your full booking details anytime:
</p>
<p style="margin:0;">
  
    href="${siteUrl}/booking/verify"
    target="_blank"
    style="background:#1B3A6B;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:8px;display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"
  >
    View my booking →
  </a>
</p>
        </div>

        <!-- Footer -->
        <div style="padding:20px 40px;border-top:1px solid #E2E8F0;background:#F5F5F0;">
          <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
            If you did not make this booking, you can ignore this email.
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  const info = await transporter.sendMail({
    from: `"FlowTrack Bookings" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your booking is confirmed — FlowTrack',
    html,
  })

  console.log('Confirmation email sent:', info.messageId)
  return info
}
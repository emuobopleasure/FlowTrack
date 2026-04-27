import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

/**
 * Landing Page
 *
 * Sections:
 * 1. Hero        — headline, subtext, CTA
 * 2. How it works — 3-step process
 * 3. Services    — what the designer offers
 * 4. Trust       — social proof and reassurance
 * 5. Final CTA   — bottom conversion push
 */

// --- DATA ---

const steps = [
  {
    number: '01',
    title: 'Choose your service',
    description:
      'Select from a custom outfit, alteration, or styling consultation. No account needed to get started.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Pick a date and submit measurements',
    description:
      'Choose your appointment date. Come in for a physical fitting or submit your measurements remotely — your choice.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Pay and receive confirmation',
    description:
      'Complete your booking with a secure Paystack payment. You will receive a confirmation email with your full booking details.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
]

const services = [
  {
    title: 'Custom Outfit',
    description:
      'A completely original piece designed and crafted to your exact measurements, style preferences, and occasion.',
    duration: 'From 2 weeks',
    tag: 'Most popular',
    tagVariant: 'primary',
  },
  {
    title: 'Alteration',
    description:
      'Expert adjustments to existing garments — resizing, hemming, taking in or letting out. Fast turnaround.',
    duration: 'From 3 days',
    tag: 'Quick delivery',
    tagVariant: 'success',
  },
  {
    title: 'Styling Consultation',
    description:
      'A one-on-one session to define your personal style, plan outfits for upcoming events, or build a wardrobe strategy.',
    duration: '60 minutes',
    tag: 'Online available',
    tagVariant: 'neutral',
  },
]

const trustPoints = [
  {
    value: '100%',
    label: 'Secure payments',
    sub: 'Powered by Paystack',
  },
  {
    value: '24hr',
    label: 'Booking confirmation',
    sub: 'Email with full details',
  },
  {
    value: 'Remote',
    label: 'Measurement options',
    sub: 'No visit required',
  },
]


// --- COMPONENTS ---

const StepCard = ({ step, index }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '32px',
      background: 'var(--color-surface-raised)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--color-surface-overlay)',
      flex: '1',
      minWidth: '0',
      animation: `slideInUp var(--duration-slow) var(--ease-smooth) ${index * 100}ms both`,
    }}
  >
    {/* Icon */}
    <div
      style={{
        width: '52px',
        height: '52px',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)',
        flexShrink: 0,
      }}
    >
      {step.icon}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Step number */}
      <span
        style={{
          fontSize: 'var(--text-label-sm)',
          fontWeight: '600',
          color: 'var(--color-primary)',
          letterSpacing: '0.08em',
        }}
      >
        STEP {step.number}
      </span>
      {/* Title */}
      <h3
        style={{
          fontSize: 'var(--text-heading-md)',
          fontWeight: '600',
          color: 'var(--color-content-primary)',
          lineHeight: '1.3',
        }}
      >
        {step.title}
      </h3>
      {/* Description */}
      <p
        style={{
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-content-secondary)',
          lineHeight: '1.7',
        }}
      >
        {step.description}
      </p>
    </div>
  </div>
)

const ServiceCard = ({ service }) => {
  const tagColors = {
    primary: {
      bg: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
    },
    success: {
      bg: 'var(--color-success-light)',
      color: 'var(--color-success-dark)',
    },
    neutral: {
      bg: 'var(--color-surface-overlay)',
      color: 'var(--color-content-secondary)',
    },
  }

  const tag = tagColors[service.tagVariant]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '32px',
        background: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-surface-overlay)',
        flex: '1',
        minWidth: '0',
        transition: `all var(--duration-base) var(--ease-smooth)`,
      }}
    >
      {/* Tag */}
      <span
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: tag.bg,
          color: tag.color,
          fontSize: 'var(--text-label-sm)',
          fontWeight: '600',
          letterSpacing: '0.04em',
        }}
      >
        {service.tag}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: '700',
            color: 'var(--color-content-primary)',
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-content-secondary)',
            lineHeight: '1.7',
          }}
        >
          {service.description}
        </p>
      </div>

      {/* Duration */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-surface-overlay)',
          marginTop: 'auto',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-content-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span
          style={{
            fontSize: 'var(--text-label-md)',
            color: 'var(--color-content-tertiary)',
            fontWeight: '500',
          }}
        >
          {service.duration}
        </span>
      </div>
    </div>
  )
}


// --- PAGE ---

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main>

        {/* ── HERO ── */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '72px',
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%,
                rgba(27,108,168,0.08) 0%,
                transparent 70%
              ),
              var(--color-surface-base)
            `,
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '32px',
            }}
          >
            {/* Eyebrow tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(27,108,168,0.15)',
                animation: 'fadeIn var(--duration-base) var(--ease-smooth)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-label-md)',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.04em',
                }}
              >
                Fashion booking made simple
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: '800',
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                color: 'var(--color-content-primary)',
                maxWidth: '800px',
                animation: 'slideInUp var(--duration-slow) var(--ease-smooth)',
              }}
            >
              Your custom outfit,{' '}
              <span style={{ color: 'var(--color-primary)' }}>
                booked in minutes.
              </span>
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-content-secondary)',
                maxWidth: '560px',
                lineHeight: '1.7',
                fontWeight: '300',
                animation: 'slideInUp var(--duration-slow) var(--ease-smooth) 100ms both',
              }}
            >
              Book a custom outfit, alteration, or styling consultation in a
              few steps. No account required. Remote measurements available.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                animation: 'slideInUp var(--duration-slow) var(--ease-smooth) 200ms both',
              }}
            >
              <Link href="/book" style={{ textDecoration: 'none' }}>
                <Button size="lg">
                  Book a session
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
              <Link href="#how-it-works" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="lg">
                  How it works
                </Button>
              </Link>
            </div>

            {/* Trust strip */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '8px',
                animation: 'fadeIn var(--duration-slow) var(--ease-smooth) 300ms both',
              }}
            >
              {[
                'No account required',
                'Secure Paystack payment',
                'Remote measurements',
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--text-label-md)',
                    color: 'var(--color-content-tertiary)',
                    fontWeight: '500',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>


        {/* ── HOW IT WORKS ── */}
        <section
          id="how-it-works"
          style={{
            padding: '96px 24px',
            background: 'var(--color-surface-base)',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* Section header */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-label-sm)',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.1em',
                }}
              >
                THE PROCESS
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-content-primary)',
                }}
              >
                Three steps to your booking
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--color-content-secondary)',
                  maxWidth: '480px',
                  margin: '0 auto',
                  fontWeight: '300',
                }}
              >
                No account. No confusion. Just a simple flow from selection
                to confirmation.
              </p>
            </div>

            {/* Steps grid */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {steps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>


        {/* ── SERVICES ── */}
        <section
          id="services"
          style={{
            padding: '96px 24px',
            background: 'var(--color-surface-raised)',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            <div
              style={{
                textAlign: 'center',
                marginBottom: '64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-label-sm)',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.1em',
                }}
              >
                SERVICES
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-content-primary)',
                }}
              >
                What would you like to book?
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>

            {/* CTA below services */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '48px',
              }}
            >
              <Link href="/book" style={{ textDecoration: 'none' }}>
                <Button size="lg">
                  Start your booking
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* ── TRUST ── */}
        <section
          style={{
            padding: '80px 24px',
            background: 'var(--color-primary)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              gap: '48px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {trustPoints.map((point) => (
              <div
                key={point.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textAlign: 'center',
                  minWidth: '160px',
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '800',
                    color: 'var(--color-content-inverse)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {point.value}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-label-lg)',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {point.label}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-label-md)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: '400',
                  }}
                >
                  {point.sub}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ── FINAL CTA ── */}
        <section
          style={{
            padding: '96px 24px',
            background: 'var(--color-surface-base)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: 'var(--color-content-primary)',
                lineHeight: '1.2',
              }}
            >
              Ready to get started?
            </h2>
            <p
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--color-content-secondary)',
                fontWeight: '300',
                lineHeight: '1.7',
              }}
            >
              Book your session in minutes. No account required.
              Your progress is saved automatically so you can
              pick up where you left off.
            </p>
            <Link href="/book" style={{ textDecoration: 'none' }}>
              <Button size="lg">
                Book a session
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            </Link>
          </div>
        </section>

      </main>


      {/* ── FOOTER ── */}
      <footer
        style={{
          background: 'var(--color-surface-inverse)',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: 'var(--text-heading-sm)',
                fontWeight: '700',
                color: 'var(--color-content-inverse)',
              }}
            >
              FlowTrack
            </span>
          </div>

          <p
            style={{
              fontSize: 'var(--text-label-md)',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: '400',
            }}
          >
            © {new Date().getFullYear()} FlowTrack. Built by Emuobonuvie Pleasure.
          </p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
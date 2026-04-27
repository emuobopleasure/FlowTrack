"use client"

/**
 * Button component
 *
 * Variants: blue | outline | white | ghost | navy
 * Sizes:    sm | md | lg
 *
 * All buttons use pill border-radius — consistent with the
 * Google Pixel-inspired design system.
 */

const variants = {
  blue: {
    background: '#1F56F4',
    color: '#FFFFFF',
    border: 'none',
    '--hover-bg': '#1644D0',
    '--hover-shadow': '0 10px 32px rgba(31,86,244,.28)',
  },
  navy: {
    background: '#080F1D',
    color: '#FFFFFF',
    border: 'none',
    '--hover-bg': '#111D35',
    '--hover-shadow': '0 10px 32px rgba(8,15,29,.25)',
  },
  outline: {
    background: 'transparent',
    color: '#080F1D',
    border: '2px solid #E3E8F2',
  },
  white: {
    background: '#FFFFFF',
    color: '#080F1D',
    border: 'none',
    '--hover-bg': '#EBF0FF',
  },
  ghost: {
    background: 'transparent',
    color: '#4B5875',
    border: '1.5px solid #E3E8F2',
  },
}

const sizes = {
  sm: { padding: '10px 22px', minHeight: '42px', fontSize: '.875rem', borderRadius: '9999px' },
  md: { padding: '14px 30px', minHeight: '50px', fontSize: '.9375rem', borderRadius: '9999px' },
  lg: { padding: '18px 40px', minHeight: '60px', fontSize: '1.0625rem', borderRadius: '9999px' },
}

export const Button = ({
  children,
  variant = 'blue',
  size = 'lg',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  style = {},
}) => {
  const v = variants[variant]
  const s = sizes[size]

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: '700',
        letterSpacing: '.01em',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease',
        ...v,
        ...s,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return
        if (v['--hover-bg']) e.currentTarget.style.background = v['--hover-bg']
        if (v['--hover-shadow']) e.currentTarget.style.boxShadow = v['--hover-shadow']
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return
        e.currentTarget.style.background = v.background
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {loading ? (
        <>
          <svg
            style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}
            viewBox="0 0 24 24" fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
            <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" fillOpacity=".75"/>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  )
}
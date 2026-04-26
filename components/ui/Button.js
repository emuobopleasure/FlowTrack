"use client"

const variants = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-content-inverse)',
    boxShadow: 'var(--shadow-button)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-content-secondary)',
    border: '1px solid var(--color-surface-overlay)',
  },
  destructive: {
    background: 'var(--color-error)',
    color: 'var(--color-content-inverse)',
  },
}

const sizes = {
  sm: { padding: '10px 20px', minHeight: '44px', fontSize: 'var(--text-label-lg)', borderRadius: 'var(--radius-md)' },
  md: { padding: '12px 24px', minHeight: '48px', fontSize: 'var(--text-body-sm)',  borderRadius: 'var(--radius-lg)' },
  lg: { padding: '16px 32px', minHeight: '56px', fontSize: 'var(--text-body-md)',  borderRadius: 'var(--radius-xl)' },
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'lg',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontWeight: '600',
        border: variants[variant].border ?? 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: `all var(--duration-base) var(--ease-smooth)`,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {loading ? (
        <>
          <svg
            style={{
              width: '20px',
              height: '20px',
              animation: 'spin 1s linear infinite',
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  )
}
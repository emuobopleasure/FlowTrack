"use client"

/**
 * Button component
 *
 * Variants: primary | ghost | destructive
 * Sizes:    sm | md | lg (default: lg — Android 16 large touch targets)
 *
 * Usage:
 * <Button variant="primary" size="lg" onClick={handleNext}>
 *   Continue
 * </Button>
 */

const sizeClasses = {
  sm: 'text-label-lg px-5 py-3 rounded-lg min-h-[44px]',
  md: 'text-body-sm px-6 py-3.5 rounded-xl min-h-[48px]',
  lg: 'text-body-md px-8 py-4 rounded-xl min-h-[56px]',
}

const variantClasses = {
  primary:     'btn-primary',
  ghost:       'btn-ghost',
  destructive: 'btn-destructive',
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
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
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
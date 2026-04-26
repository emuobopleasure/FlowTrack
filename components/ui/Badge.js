/**
 * Badge component — status indicators
 *
 * Usage:
 * <Badge variant="success">Paid</Badge>
 * <Badge variant="error">Failed</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="neutral">Active</Badge>
 */

const variantClasses = {
  success: 'badge-success',
  error:   'badge-error',
  warning: 'badge-warning',
  neutral: 'badge-neutral',
}

export const Badge = ({ children, variant = 'neutral' }) => {
  const dots = {
    success: 'bg-success',
    error:   'bg-error',
    warning: 'bg-warning',
    neutral: 'bg-content-tertiary',
  }

  return (
    <span className={variantClasses[variant]}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />
      {children}
    </span>
  )
}
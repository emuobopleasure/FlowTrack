const variants = {
  success: {
    background: 'var(--color-success-light)',
    color: 'var(--color-success-dark)',
    dot: 'var(--color-success)',
  },
  error: {
    background: 'var(--color-error-light)',
    color: 'var(--color-error-dark)',
    dot: 'var(--color-error)',
  },
  warning: {
    background: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
    dot: 'var(--color-warning)',
  },
  neutral: {
    background: 'var(--color-surface-overlay)',
    color: 'var(--color-content-secondary)',
    dot: 'var(--color-content-tertiary)',
  },
}

export const Badge = ({ children, variant = 'neutral' }) => {
  const styles = variants[variant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: styles.background,
        color: styles.color,
        fontSize: 'var(--text-label-sm)',
        fontWeight: '500',
        padding: '4px 12px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: styles.dot,
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  )
}
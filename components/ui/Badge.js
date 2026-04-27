/**
 * Badge component
 * Variants: blue | success | error | neutral
 */

const variants = {
  blue:    { bg: '#EBF0FF', color: '#1F56F4', dot: '#1F56F4' },
  success: { bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  error:   { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
  neutral: { bg: '#E3E8F2', color: '#4B5875', dot: '#8E9DB8' },
}

export const Badge = ({ children, variant = 'neutral' }) => {
  const s = variants[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: s.bg,
        color: s.color,
        fontSize: '.6875rem',
        fontWeight: '500',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontFamily: "'DM Mono', monospace",
        letterSpacing: '.06em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {children}
    </span>
  )
}
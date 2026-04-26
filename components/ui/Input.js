"use client"

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  children,
}) => {
  const baseStyle = {
    width: '100%',
    padding: '16px',
    minHeight: '56px',
    borderRadius: 'var(--radius-lg)',
    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-surface-overlay)'}`,
    background: 'var(--color-surface-raised)',
    color: 'var(--color-content-primary)',
    fontSize: 'var(--text-body-md)',
    fontFamily: 'var(--font-sans)',
    transition: `all var(--duration-base) var(--ease-smooth)`,
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'auto',
  }

  const id = label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--text-label-lg)',
            fontWeight: '500',
            color: 'var(--color-content-secondary)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-error)', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={className}
          style={{ ...baseStyle, resize: 'none', minHeight: '120px' }}
          aria-invalid={!!error}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={className}
          style={{ ...baseStyle, cursor: 'pointer' }}
          aria-invalid={!!error}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={className}
          style={baseStyle}
          aria-invalid={!!error}
        />
      )}

      {error && (
        <p
          role="alert"
          style={{
            fontSize: 'var(--text-label-md)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-content-tertiary)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
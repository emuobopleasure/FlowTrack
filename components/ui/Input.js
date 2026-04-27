"use client"

/**
 * Input component
 *
 * Handles: text, email, tel, date, time, textarea, select
 * Min height 56px on all inputs — large touch targets.
 */

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
  rows = 4,
  children,
  className = '',
}) => {
  const id = label?.toLowerCase().replace(/\s+/g, '-')

  const baseStyle = {
    width: '100%',
    minHeight: type === 'textarea' ? 'auto' : '56px',
    padding: type === 'textarea' ? '16px' : '0 18px',
    borderRadius: '14px',
    border: `1.5px solid ${error ? '#EF4444' : '#E3E8F2'}`,
    background: '#FFFFFF',
    color: '#080F1D',
    fontSize: '1rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: '400',
    transition: 'border-color .2s ease, box-shadow .2s ease',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'auto',
    display: 'flex',
    alignItems: 'center',
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = error ? '#EF4444' : '#1F56F4'
    e.target.style.boxShadow = error
      ? '0 0 0 3px rgba(239,68,68,.12)'
      : '0 0 0 3px rgba(31,86,244,.12)'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? '#EF4444' : '#E3E8F2'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '.875rem',
            fontWeight: '600',
            color: '#4B5875',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#1F56F4', marginLeft: '3px' }}>*</span>
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
          style={{ ...baseStyle, resize: 'vertical', minHeight: '120px', padding: '16px' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={className}
          style={{ ...baseStyle, cursor: 'pointer', paddingRight: '40px' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
        />
      )}

      {error && (
        <p
          role="alert"
          style={{
            fontSize: '.8125rem',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p style={{ fontSize: '.8125rem', color: '#8E9DB8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {hint}
        </p>
      )}
    </div>
  )
}
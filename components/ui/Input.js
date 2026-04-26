"use client"

/**
 * Input component
 *
 * Handles: text, email, tel, date, time, textarea, select
 *
 * Usage:
 * <Input
 *   label="Email address"
 *   type="email"
 *   placeholder="james@example.com"
 *   value={formData.email}
 *   onChange={(e) => updateFormData({ email: e.target.value })}
 *   error={errors.email}
 * />
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
  className = '',
  rows = 4,
  children, // for select options
}) => {
  const inputClasses = `input-base ${error ? 'input-error' : ''} ${className}`

  return (
    <div className="field">
      {label && (
        <label className="label-base">
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${inputClasses} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!error}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
      )}

      {/* Error message */}
      {error && (
        <p
          id={`${label}-error`}
          className="text-label-md text-error flex items-center gap-1.5"
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="text-label-md text-content-tertiary">{hint}</p>
      )}
    </div>
  )
}
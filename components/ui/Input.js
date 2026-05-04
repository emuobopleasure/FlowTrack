"use client";

/* ============================================================
   Input — Reusable form input component
   Handles: text, email, tel, date, textarea
   Shows label, error message, and help text.
   ============================================================ */

export default function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = "",
  helpText = "",
  rows,       // only for textarea
  className = "",
  ...props
}) {
  const baseClass = [
    "w-full px-4 py-3.5 rounded-xl border text-text-primary text-base",
    "placeholder:text-text-muted bg-white",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-navy/40 focus:border-navy",
    error
      ? "border-error bg-error/5"
      : "border-border-light hover:border-border",
    className,
  ].join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text-primary">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className={baseClass + " resize-none"}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClass}
          {...props}
        />
      )}

      {error && (
        <span className="text-xs text-error font-medium" role="alert">{error}</span>
      )}
      {helpText && !error && (
        <span className="text-xs text-text-muted">{helpText}</span>
      )}
    </div>
  );
}

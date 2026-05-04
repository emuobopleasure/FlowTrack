/* ============================================================
   Badge — Status Indicator
   Server Component — no interactivity needed, renders as HTML.
   Used for: payment status, booking status, service type labels.

   Variants: default | success | error | warning | outline
   ============================================================ */

const variants = {
  default:  "bg-navy/10 text-navy",
  success:  "bg-success/10 text-success",
  error:    "bg-error/10 text-error",
  warning:  "bg-warning/10 text-warning",
  outline:  "border border-border text-text-secondary bg-transparent",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "px-3 py-1 rounded-full",
        "text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

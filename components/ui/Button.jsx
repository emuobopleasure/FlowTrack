"use client";

const variants = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
};

const sizes = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "btn",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
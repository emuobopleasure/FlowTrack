/**
 * Scrolls to the first element with a given ID or data attribute
 * that has a validation error. Adds a smooth scroll into view.
 *
 * Usage: scrollToError(errors)
 * where errors is { fieldId: "error message", ... }
 */
export const scrollToError = (errors) => {
  const firstErrorKey = Object.keys(errors).find((key) => errors[key])
  if (!firstErrorKey) return

  const el =
    document.getElementById(firstErrorKey) ||
    document.getElementById(`meas-${firstErrorKey}`) ||
    document.getElementById(`alt-${firstErrorKey}`) ||
    document.querySelector(`[data-field="${firstErrorKey}"]`)

  if (!el) return

  el.scrollIntoView({ behavior: "smooth", block: "center" })
  el.focus({ preventScroll: true })
}
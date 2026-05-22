"use client"

import { useEffect, useRef } from "react"

/**
 * useAnalytics
 *
 * Fires step analytics events to /api/analytics.
 *
 * Events fired automatically:
 * - "entered"   → when the step mounts
 * - "abandoned" → when the user leaves without completing
 *                 (back button, exit booking, tab close)
 * - "completed" → called manually when the user clicks Continue
 *
 * Usage in each step:
 *
 * const { trackCompleted } = useAnalytics({
 *   step: 1,
 *   anonymousSessionId,
 *   email: formData.email,
 * })
 *
 * // Call this inside handleContinue before nextStep()
 * trackCompleted()
 */
export const useAnalytics = ({ step, anonymousSessionId, email = null }) => {
  const enteredAt   = useRef(Date.now())
  const completed   = useRef(false)

  const track = (event) => {
    const timeSpent = Math.round((Date.now() - enteredAt.current) / 1000)

    // Use sendBeacon so events are not lost on tab close
    const payload = JSON.stringify({
      step,
      event,
      timeSpent,
      anonymousSessionId,
      email,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", payload)
    } else {
      // Fallback for browsers without sendBeacon
      fetch("/api/analytics", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    payload,
        keepalive: true,
      }).catch(() => {})
    }
  }

  useEffect(() => {
    // Fire "entered" when the step mounts
    track("entered")

    // Fire "abandoned" when the step unmounts without completing
    return () => {
      if (!completed.current) {
        track("abandoned")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const trackCompleted = () => {
    completed.current = true
    track("completed")
  }

  return { trackCompleted }
}
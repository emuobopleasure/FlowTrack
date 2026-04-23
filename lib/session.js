/**
 * Session helpers for email-based persistence.
 *
 * Steps 1–3: anonymous — no identifier, progress lives in React state only.
 * Step 4 onward: email becomes the persistent identifier stored in MongoDB.
 *
 * If the customer switches devices before step 4 — they start over.
 * If they switch devices after step 4 — they enter their email again
 * and their progress is fully restored from MongoDB.
 */

// Links the anonymous session data (steps 1–3) to the customer's email
// once they complete the email gate at step 4.
export const linkSessionToEmail = async (sessionId, email, formData) => {
  const response = await fetch('/api/session', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, email, formData })
  })

  if (!response.ok) throw new Error('Failed to link session to email')
  return response.json()
}

// Restores progress for a returning customer who enters their email at step 4
// on a different device or browser.
export const restoreSessionByEmail = async (email) => {
  const response = await fetch(`/api/session?email=${email}`)
  if (!response.ok) return null
  return response.json()
}
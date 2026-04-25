import { handlers } from '@/auth'

/**
 * NextAuth route handler
 *
 * The [...nextauth] catches all auth-related requests:
 * - GET  /api/auth/session    → returns current session
 * - POST /api/auth/signin     → handles login submission
 * - POST /api/auth/signout    → handles logout
 * - GET  /api/auth/csrf       → returns CSRF token
 *
 * We just export the handlers from auth.js — NextAuth
 * takes care of everything else automatically.
 */
export const { GET, POST } = handlers
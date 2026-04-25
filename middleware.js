import { auth } from './auth'

/**
 * Middleware runs on every request before the page renders.
 * It checks for a valid session on all /admin/* routes.
 *
 * If the designer is not logged in and tries to access any
 * admin route, they are redirected to /admin/login immediately —
 * the page never renders, no data is ever fetched.
 *
 * This is more secure than checking auth inside each page
 * because the redirect happens at the network level, not
 * after the page has already started loading.
 */
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isLoggedIn = !!req.auth

  // Allow access to the login page whether logged in or not
  if (isLoginPage) return

  // Redirect to login if trying to access any admin route without a session
  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl))
  }
})

export const config = {
  // Only run middleware on admin routes
  // Avoids unnecessary checks on public pages
  matcher: ['/admin/:path*'],
}
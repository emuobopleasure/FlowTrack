import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

/**
 * NextAuth v5 configuration
 *
 * Uses CredentialsProvider — the simplest auth setup for a single admin user.
 * The admin email and password are stored in .env.local, not in the database.
 * This is appropriate for a single-user admin panel like FlowTrack's dashboard.
 *
 * How it works:
 * 1. Designer submits email + password on /admin/login
 * 2. NextAuth calls the authorize function below
 * 3. We compare submitted credentials against .env.local values
 * 4. On match: NextAuth creates a session cookie and redirects to dashboard
 * 5. On no match: returns null — NextAuth handles the error
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async (credentials) => {
        const { email, password } = credentials

        if (!email || !password) return null

        // Compare against environment variables — never hardcode credentials
        const isValidEmail =
          email.toLowerCase().trim() ===
          process.env.ADMIN_EMAIL.toLowerCase().trim()

        const isValidPassword = password === process.env.ADMIN_PASSWORD

        if (!isValidEmail || !isValidPassword) return null

        // Return a user object on success
        // This gets stored in the session token
        return {
          id: 'admin',
          email: process.env.ADMIN_EMAIL,
          name: 'Admin',
        }
      },
    }),
  ],

  pages: {
    signIn: '/admin/login',
    // Tells NextAuth to use our custom login page
    // instead of its default one
  },

  callbacks: {
    // Controls what gets stored in the session
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },

  session: {
    strategy: 'jwt',
    // Store session in a JWT cookie — no database session table needed
    maxAge: 24 * 60 * 60,
    // Session expires after 24 hours — designer must log in again
  },
})
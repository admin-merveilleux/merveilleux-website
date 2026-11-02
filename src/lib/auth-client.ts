import { createAuthClient } from '@neondatabase/auth'
import { BetterAuthReactAdapter } from '@neondatabase/auth/react'

const authUrl =
  process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL ||
  'https://ep-bitter-morning-zafpp8i0.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth'

export const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
})

export const ALLOWED_DOMAIN = 'merveilleux.design'

/**
 * Trigger Google OAuth sign-in restricted to @merveilleux.design accounts
 */
export async function signInWithGoogle(redirectTo = '/admin') {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const callbackURL = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`

  return await authClient.signIn.social({
    provider: 'google',
    callbackURL,
  })
}

export const { useSession, signOut } = authClient

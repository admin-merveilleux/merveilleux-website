import { createAuthClient } from '@neondatabase/auth/next'

export const authClient = createAuthClient()

export const ALLOWED_DOMAIN = 'merveilleux.design'

/**
 * Déclenche l'authentification Google OAuth pour les comptes @merveilleux.design
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

import { createAuthClient } from '@neondatabase/auth/next'

export const authClient = createAuthClient()

export const ALLOWED_DOMAIN = 'merveilleux.design'

/**
 * Déclenche l'authentification Google OAuth pour les comptes @merveilleux.design
 * avec relance automatique en cas de mise en veille temporaire de Neon (erreur 502).
 */
export async function signInWithGoogle(redirectTo = '/admin', maxRetries = 2) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const callbackURL = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`

  let lastError: any = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      })
    } catch (err: any) {
      lastError = err
      const is502 =
        err?.status === 502 ||
        err?.statusCode === 502 ||
        String(err?.message || '').includes('502') ||
        String(err || '').includes('502')

      if (is502 && attempt < maxRetries) {
        console.warn(`[Neon Auth] Serveur en réveil (502), nouvelle tentative (${attempt + 1}/${maxRetries}) dans 1.5s...`)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        continue
      }
      throw err
    }
  }
  throw lastError
}

export const { useSession, signOut } = authClient

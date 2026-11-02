'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient, ALLOWED_DOMAIN } from '@/lib/auth-client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/admin'

  const [status, setStatus] = useState<'checking' | 'valid' | 'forbidden' | 'error'>('checking')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function verifyDomain() {
      try {
        const session = await authClient.getSession()

        if (!session?.data?.user?.email) {
          setTimeout(async () => {
            const retrySession = await authClient.getSession()
            if (!retrySession?.data?.user?.email) {
              setStatus('error')
              return
            }
            handleValidation(retrySession.data.user.email)
          }, 600)
          return
        }

        handleValidation(session.data.user.email)
      } catch (err) {
        console.error('Erreur vérification session:', err)
        setStatus('error')
      }
    }

    async function handleValidation(email: string) {
      setUserEmail(email)
      const normalizedEmail = email.toLowerCase()

      // ─── VÉRIFICATION STRICTE DU DOMAINE D'ENTREPRISE ───────
      if (!normalizedEmail.endsWith(`@${ALLOWED_DOMAIN}`)) {
        console.warn(`[Better Auth] Accès refusé pour ${email} (domaine non @${ALLOWED_DOMAIN})`)
        await authClient.signOut()
        setStatus('forbidden')
        return
      }

      setStatus('valid')

      // Synchroniser avec la base Payload CMS
      try {
        await fetch('/api/auth/sync-payload', { method: 'POST' })
      } catch (e) {
        console.error('Erreur sync payload:', e)
      }

      // Rediriger vers l'admin
      router.push(redirectUrl)
    }

    verifyDomain()
  }, [router, redirectUrl])

  return (
    <div style={{
      maxWidth: 480,
      width: '100%',
      padding: '36px 32px',
      backgroundColor: '#14171d',
      border: '1px solid #252b35',
      borderRadius: 12,
      textAlign: 'center',
    }}>
      {status === 'checking' && (
        <>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #252b35',
            borderTopColor: '#7FFF00',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite',
          }} />
          <h2 style={{ fontSize: 20, margin: '0 0 8px' }}>Vérification du compte...</h2>
          <p style={{ color: '#9aa2b1', fontSize: 14, margin: 0 }}>
            Validation du domaine <strong>@{ALLOWED_DOMAIN}</strong> en cours.
          </p>
        </>
      )}

      {status === 'valid' && (
        <>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, margin: '0 0 8px', color: '#7FFF00' }}>
            Authentification réussie !
          </h2>
          <p style={{ color: '#9aa2b1', fontSize: 14 }}>
            Bienvenue, <strong>{userEmail}</strong>. Redirection vers l’administration...
          </p>
        </>
      )}

      {status === 'forbidden' && (
        <>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⛔</div>
          <h2 style={{ fontSize: 20, margin: '0 0 8px', color: '#ff4d4f' }}>
            Accès refusé
          </h2>
          <p style={{ color: '#c4cad4', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Le compte <strong>{userEmail}</strong> n'est pas autorisé. Seules les adresses professionnelles se terminant par <code style={{ color: '#7FFF00', background: 'rgba(127,255,0,0.1)', padding: '2px 6px', borderRadius: 4 }}>@{ALLOWED_DOMAIN}</code> peuvent se connecter à cet espace.
          </p>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              backgroundColor: '#252b35',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Réessayer avec un compte d'entreprise
          </a>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, margin: '0 0 8px', color: '#faad14' }}>
            Erreur d’authentification
          </h2>
          <p style={{ color: '#9aa2b1', fontSize: 14, marginBottom: 20 }}>
            Une erreur s'est produite lors de la connexion Google.
          </p>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              backgroundColor: '#252b35',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Retour à la page de connexion
          </a>
        </>
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: '#0a0b0d',
      color: '#f0f2f5',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <Suspense fallback={
        <div style={{ color: '#9aa2b1', fontSize: 16 }}>Chargement...</div>
      }>
        <AuthCallbackContent />
      </Suspense>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { authClient, signInWithGoogle } from '@/lib/auth-client'

export const BeforeLogin: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pré-réveil automatique et transparent du backend Neon dès l'affichage de la page de login
  useEffect(() => {
    authClient.getSession().catch(() => {})
  }, [])

  const handleGoogleClick = async () => {
    try {
      setErrorMessage(null)
      setLoading(true)
      setStatusMessage('Connexion à Google en cours...')
      await signInWithGoogle('/admin')
    } catch (err: any) {
      console.warn('Erreur connexion Google:', err)
      setLoading(false)
      setStatusMessage(null)

      const errStr = String(err?.message || err || '')
      if (errStr.includes('502') || err?.status === 502) {
        setErrorMessage(
          'La base de données était en veille et vient d’être réveillée. Veuillez recliquer pour vous connecter.'
        )
      } else {
        setErrorMessage('Impossible d’initialiser la connexion Google. Veuillez recliquer ou utiliser vos identifiants.')
      }
    }
  }

  return (
    <div style={{ width: '100%', marginBottom: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 700,
          margin: '0',
          color: 'var(--theme-elevation-800, #ffffff)',
          letterSpacing: '-0.02em',
        }}>
          Connexion
        </h1>
      </div>

      {errorMessage && (
        <div style={{
          backgroundColor: 'rgba(234, 67, 53, 0.12)',
          border: '1px solid rgba(234, 67, 53, 0.35)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '14px',
          fontSize: '13px',
          color: '#ff7b72',
          lineHeight: '1.4',
        }}>
          {errorMessage}
        </div>
      )}

      {/* Bouton Google SSO */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          backgroundColor: '#ffffff',
          color: '#1f2328',
          border: '1px solid #d0d7de',
          borderRadius: '8px',
          padding: '11px 16px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.75 : 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.039l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
          />
        </svg>
        <span>
          {statusMessage || 'Continuer avec Google'}
        </span>
      </button>

      {/* Séparateur */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '22px 0 16px',
        color: 'var(--theme-elevation-400, #656d76)',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--theme-elevation-200, #30363d)' }} />
        <span style={{ padding: '0 12px' }}>ou avec mot de passe</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--theme-elevation-200, #30363d)' }} />
      </div>
    </div>
  )
}

export default BeforeLogin

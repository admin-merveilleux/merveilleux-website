'use client'

import React, { useState } from 'react'
import { signInWithGoogle, ALLOWED_DOMAIN } from '@/lib/auth-client'

export function GoogleLoginButton({
  redirectTo = '/admin',
  label = 'Continuer avec Google Workspace',
}: {
  redirectTo?: string
  label?: string
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle(redirectTo)
    } catch (error) {
      console.error('Erreur lancement connexion Google:', error)
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          backgroundColor: '#ffffff',
          color: '#1f2328',
          border: '1px solid #d0d7de',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 15,
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
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
        <span>{isLoading ? 'Redirection vers Google...' : label}</span>
      </button>

      <p style={{
        marginTop: 10,
        fontSize: 12,
        color: '#656d76',
        textAlign: 'center',
        margin: '10px 0 0 0',
      }}>
        Réservé exclusivement aux comptes <strong style={{ color: '#7FFF00' }}>@{ALLOWED_DOMAIN}</strong>
      </p>
    </div>
  )
}

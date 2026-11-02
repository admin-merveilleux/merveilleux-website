import React from 'react'
import { GoogleLoginButton } from '@/components/GoogleLoginButton'

export const metadata = {
  title: 'Connexion Équipe — merveilleUX',
  description: 'Authentification Google Workspace réservée aux collaborateurs @merveilleux.design',
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(circle at 50% 20%, #161c24 0%, #0a0b0d 70%)',
      color: '#f0f2f5',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        padding: '40px 32px',
        backgroundColor: '#14171d',
        border: '1px solid #252b35',
        borderRadius: 16,
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        {/* Brand Logo / Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: 'rgba(127, 255, 0, 0.1)',
            border: '1px solid rgba(127, 255, 0, 0.3)',
            marginBottom: 16,
          }}>
            <span style={{ color: '#7FFF00', fontSize: 24, fontWeight: 900 }}>M</span>
          </div>

          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            merveille<span style={{ color: '#7FFF00' }}>UX</span> Studio
          </h1>

          <p style={{
            color: '#9aa2b1',
            fontSize: 14,
            margin: 0,
            lineHeight: 1.5,
          }}>
            Accès sécurisé à l’administration & CMS
          </p>
        </div>

        {/* Auth Box */}
        <div style={{
          padding: '24px 20px',
          backgroundColor: '#0d0f12',
          border: '1px solid #1c2128',
          borderRadius: 12,
          marginBottom: 24,
        }}>
          <GoogleLoginButton redirectTo="/admin" />
        </div>

        <div style={{
          borderTop: '1px solid #1c2128',
          paddingTop: 18,
          fontSize: 13,
          color: '#656d76',
        }}>
          Vous avez également la possibilité de vous connecter par identifiant / mot de passe sur{' '}
          <a href="/admin" style={{ color: '#7FFF00', textDecoration: 'none' }}>
            l'interface native
          </a>.
        </div>
      </div>
    </div>
  )
}

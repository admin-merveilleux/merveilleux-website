import React from 'react'

export default function HomePage() {
  return (
    <main style={{
      maxWidth: 800,
      margin: '80px auto',
      padding: '0 24px',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-block',
        padding: '6px 14px',
        backgroundColor: 'rgba(127, 255, 0, 0.12)',
        color: '#7FFF00',
        borderRadius: 9999,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>
        Stack Backend & CMS v4 Opérationnelle
      </div>

      <h1 style={{
        fontSize: '44px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        margin: '0 0 16px',
      }}>
        merveille<span style={{ color: '#7FFF00' }}>UX</span> Redesign
      </h1>

      <p style={{
        fontSize: 18,
        color: '#9aa2b1',
        lineHeight: 1.6,
        maxWidth: 600,
        margin: '0 auto 36px',
      }}>
        Socle technique configuré avec <strong>Payload CMS v4 (Beta)</strong>, <strong>Next.js</strong> et <strong>PostgreSQL</strong> (Neon). Les collections, le schéma SEO pour les articles de blog et la structure des données sont prêts.
      </p>

      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <a
          href="/admin"
          style={{
            display: 'inline-block',
            backgroundColor: '#7FFF00',
            color: '#0a0b0d',
            padding: '12px 24px',
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 15,
          }}
        >
          Accéder à l'Admin Payload CMS →
        </a>
      </div>
    </main>
  )
}

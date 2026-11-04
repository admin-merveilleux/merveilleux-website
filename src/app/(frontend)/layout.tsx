import React from 'react'
import Link from 'next/link'
import './blog.css'

export const metadata = {
  title: 'merveilleUX — Product Design pour SaaS B2B',
  description: 'Agence UX/UI spécialisée pour les plateformes SaaS et produits complexes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="logo-brand">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3 9.5V22.5L16 30L29 22.5V9.5L16 2Z" stroke="#7FFF00" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M16 11V21" stroke="#7FFF00" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 14.5L16 18L22 14.5" stroke="#7FFF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>merveille<span className="accent">UX</span></div>
            </Link>

            <nav className="nav-links">
              <Link href="/fr/blog">Blog</Link>
              <Link href="/admin" className="btn-admin">
                Payload Admin →
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>

        <footer style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 24px',
          textAlign: 'center',
          color: '#737c8e',
          fontSize: '14px',
        }}>
          <p>© {new Date().getFullYear()} merveilleUX. Tous droits réservés.</p>
        </footer>
      </body>
    </html>
  )
}

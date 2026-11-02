import React from 'react'

export const metadata = {
  title: 'merveilleUX — Product Design pour SaaS B2B',
  description: 'Refonte en cours — Backend Payload CMS v4 & Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#0a0b0d',
        color: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </body>
    </html>
  )
}

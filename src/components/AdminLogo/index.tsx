import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0 8px', width: '100%' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          backgroundColor: '#0d0f12',
          border: '1px solid rgba(127, 255, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(127, 255, 0, 0.15)',
        }}>
          <span style={{ color: '#7FFF00', fontSize: 20, fontWeight: 900 }}>M</span>
        </div>
        <span style={{
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--theme-text, #ffffff)',
          letterSpacing: '-0.03em',
        }}>
          merveille<span style={{ color: '#7FFF00' }}>UX</span>
        </span>
      </div>
    </div>
  )
}

export default AdminLogo

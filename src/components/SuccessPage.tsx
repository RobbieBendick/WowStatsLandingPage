import { isTauri } from '@tauri-apps/api/core';

export default function SuccessPage() {
  return (
    <div
      className='hero'
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      {/* Animated checkmark */}
      <div
        style={{
          fontSize: '6rem',
          color: '#4ade80',
          animation: 'pop 0.5s ease',
        }}
      >
        ✅
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <span style={{ display: 'inline-block', transform: 'scale(2)' }}>
          🎉
        </span>
        <h1
          className='hero-title gradient-text'
          style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}
        >
          Subscription Activated!
        </h1>
      </div>

      <p
        style={{
          maxWidth: '500px',
          color: '#e0e0e0',
          fontSize: '1.1rem',
          lineHeight: '1.6',
        }}
      >
        Congratulations! Your WoWStats Pro subscription is now active. You can
        enjoy advanced analytics, arena stats, and premium features.
      </p>

      {isTauri() && (
        <div
          style={{
            maxWidth: '500px',
            backgroundColor: 'rgba(255, 223, 0, 0.15)', // subtle yellow
            color: '#ffd700', // text color
            fontWeight: 'bold',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginTop: '1rem',
            lineHeight: 1.5,
          }}
        >
          Using the desktop app? You can either <strong>restart</strong> it, or{' '}
          <strong>right-click and select Back TWICE</strong> to see your Pro
          features.
        </div>
      )}
    </div>
  );
}

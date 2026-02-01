import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isTauri } from '@tauri-apps/api/core';

export default function SuccessPage() {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isTauri()) {
      setCanClose(true); // Only show "Close" button if inside Tauri
    }
  }, []);

  return (
    <div
      className='hero'
      style={{
        minHeight: '100vh',
        paddingTop: '6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '2rem',
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

      <h1
        className='hero-title gradient-text'
        style={{ fontSize: '2.5rem', fontWeight: 700 }}
      >
        🎉 Subscription Activated!
      </h1>

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

      <p
        style={{
          maxWidth: '500px',
          color: '#ffd700',
          fontWeight: 'bold',
        }}
      >
        {isTauri() && (
          <p>
            Using the desktop app? You can either <strong>restart</strong> it,
            or <strong>right-click and select Back TWICE</strong> to see your
            Pro features.
          </p>
        )}
      </p>
    </div>
  );
}

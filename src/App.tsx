import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Features from './components/Features';
import About from './components/About';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { exchangeCodeAndSaveUser, refreshSubscription, loginWithDiscord } from './utils/auth';
import './style.css';

function App() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const exchangeStarted = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const clientType = urlParams.get('client');
    const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

    if (code && clientType === 'tauri' && !isTauri) {
      window.location.href = `wowstats://auth/callback?code=${encodeURIComponent(code)}`;
      return;
    }

    if (code && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setIsExchanging(true);
      setAuthError(null);
      exchangeCodeAndSaveUser(code).then((ok) => {
        setIsExchanging(false);
        if (ok) {
          const path = window.location.pathname || '/';
          window.history.replaceState({}, document.title, path);
          window.dispatchEvent(new Event('userAuthChange'));
          setTimeout(() => window.dispatchEvent(new Event('userAuthChange')), 50);
          refreshSubscription();
        } else {
          setAuthError('Login failed. Please try again.');
          window.history.replaceState({}, document.title, window.location.pathname || '/');
        }
      });
    } else if (!code) {
      refreshSubscription();
    }
  }, []);

  return (
    <>
      {authError && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#d32f2f',
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <span>{authError}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                loginWithDiscord();
              }}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {isExchanging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
          }}
        >
          Logging in…
        </div>
      )}
      {/* Rising dots background (same as Tauri app) */}
      <div
        className='animated-dots-wrapper'
        aria-hidden='true'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div className='animated-background' />
        <div className='animated-background-angle-1' />
        <div className='animated-background-angle-2' />
        <div className='animated-background-angle-3' />
        <div className='animated-background-angle-4' />
      </div>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <About />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;

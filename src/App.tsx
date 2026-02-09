import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Features from './components/Features';
import About from './components/About';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { saveUser, refreshSubscription } from './utils/auth';
import type { DiscordUser } from './utils/auth';
import './style.css';

function App() {
  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const clientType = urlParams.get('client'); // Check if this is a Tauri callback

    // Check if we're in Tauri app - if so, don't do web redirect logic
    const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

    // If this is explicitly marked as a Tauri callback, redirect to the app
    // This is a safety net in case a Tauri OAuth callback somehow ends up on the landing page
    if (userParam && clientType === 'tauri' && !isTauri) {
      // Redirect to Tauri app via deep link
      const tauriRedirectURL = `wowstats://auth/callback?user=${userParam}`;
      console.log(
        'Detected Tauri OAuth callback on landing page, redirecting to app',
      );
      window.location.href = tauriRedirectURL;
      return; // Don't process as web callback
    }

    // Normal web callback processing
    if (userParam) {
      try {
        // Decode base64 user data
        const userJSON = atob(userParam);
        const user: DiscordUser = JSON.parse(userJSON);

        // Save user first
        saveUser(user);

        // Refresh subscription status (will update user in localStorage)
        refreshSubscription().then(() => {
          // Clean up URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );

          // Dispatch event to update all components
          window.dispatchEvent(new Event('userAuthChange'));
        });
      } catch (error) {
        console.error('Failed to parse user data from callback:', error);
      }
    } else {
      // Check if user is already logged in and refresh subscription status
      refreshSubscription();
    }
  }, []);

  return (
    <>
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

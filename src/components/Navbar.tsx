import { useState, useEffect } from 'react'
import { useLatestRelease } from '../hooks/useLatestRelease'
import { loginWithDiscord, clearUser } from '../utils/auth'
import { useSubscription } from '../hooks/useSubscription'

// Get base URL for GitHub Pages compatibility
const baseUrl = import.meta.env.BASE_URL

export default function Navbar() {
  const { downloadUrl, loading } = useLatestRelease()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSubscribed } = useSubscription()

  const handleLogin = () => {
    loginWithDiscord()
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
    // Dispatch custom event to update other components
    window.dispatchEvent(new Event('userAuthChange'))
    setIsMenuOpen(false)
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMenuOpen(false)
  }

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault()
      return
    }
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {isMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src={`${baseUrl}icons/ws-icon.png`} alt="WowStats Logo" className="logo-img" />
            <span>WowStats</span>
          </div>
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" onClick={(e) => handleScroll(e, '#features')}>
            Features
          </a>
          <a href="#about" onClick={(e) => handleScroll(e, '#about')}>
            About
          </a>
          <a href="#pricing" onClick={(e) => handleScroll(e, '#pricing')}>
            Pricing
          </a>
          <a href="#contact" onClick={(e) => handleScroll(e, '#contact')}>
            Contact
          </a>
          {user ? (
            <>
              <span className="nav-user" style={{ color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.username}
                {isSubscribed && (
                  <span style={{ 
                    background: '#4ade80', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    PRO
                  </span>
                )}
              </span>
              <button 
                onClick={handleLogout}
                className="nav-login"
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={handleLogin}
              className="nav-login"
              style={{ 
                background: '#5865F2', 
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Login
            </button>
          )}
          <a 
            href={downloadUrl || 'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'}
            onClick={handleDownload}
            download
            className="cta-button"
          >
            {loading ? 'Loading...' : 'Download'}
          </a>
        </div>
      </div>
    </nav>
    </>
  )
}

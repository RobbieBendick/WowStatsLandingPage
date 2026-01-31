import { useState, useEffect, useRef } from 'react';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { loginWithDiscord, clearUser } from '../utils/auth';
import { useSubscription } from '../hooks/useSubscription';

// Get base URL for GitHub Pages compatibility
const baseUrl = import.meta.env.BASE_URL;

export default function Navbar() {
  const { downloadUrl, loading } = useLatestRelease();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isSubscribed } = useSubscription();

  const handleLogin = () => {
    loginWithDiscord();
  };

  const handleLogout = () => {
    clearUser();
    window.dispatchEvent(new Event('userAuthChange'));
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault();
      return;
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className='mobile-menu-backdrop'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='logo'>
            <img
              src={`${baseUrl}icons/ws-icon.png`}
              alt='WowStats Logo'
              className='logo-img'
            />
            <span>WowStats</span>
          </div>
          <button
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label='Toggle menu'
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href='#features' onClick={e => handleScroll(e, '#features')}>
              Features
            </a>
            <a href='#about' onClick={e => handleScroll(e, '#about')}>
              About
            </a>
            <a href='#pricing' onClick={e => handleScroll(e, '#pricing')}>
              Pricing
            </a>
            <a href='#contact' onClick={e => handleScroll(e, '#contact')}>
              Contact
            </a>
            {user ? (
              <div
                ref={dropdownRef}
                style={{ position: 'relative', marginRight: '1rem' }}
              >
                <div
                  className='nav-user'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith('http')
                          ? user.avatar
                          : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                      }
                      alt={user.username}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#5865F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    style={{ color: 'var(--text-primary)', fontWeight: '500' }}
                  >
                    {user.username}
                  </span>
                  <svg
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    fill='none'
                    style={{
                      transition: 'transform 0.2s',
                      transform: isDropdownOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                  >
                    <path
                      d='M2 4L6 8L10 4'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.75rem',
                      background: 'rgba(15, 15, 25, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '0',
                      minWidth: '220px',
                      boxShadow:
                        '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                      zIndex: 1000,
                      opacity: 0,
                      transform: 'translateY(-8px) scale(0.95)',
                      animation: 'dropdownFadeIn 0.2s ease-out forwards',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Header with user info */}
                    <div
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      {user.avatar ? (
                        <img
                          src={
                            user.avatar.startsWith('http')
                              ? user.avatar
                              : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                          }
                          alt={user.username}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: '#5865F2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px',
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            marginBottom: '0.25rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.username}
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          {isSubscribed ? (
                            <span
                              style={{
                                background:
                                  'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              Pro
                            </span>
                          ) : (
                            <span
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'var(--text-secondary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                              }}
                            >
                              Free Plan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Logout button */}
                    <div style={{ padding: '0.5rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                          <polyline points='16 17 21 12 16 7' />
                          <line x1='21' y1='12' x2='9' y2='12' />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className='nav-login'
                style={{
                  background: '#5865F2',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Login
              </button>
            )}
            <a
              href={
                downloadUrl ||
                'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'
              }
              onClick={handleDownload}
              download
              className='cta-button'
            >
              {loading ? 'Loading...' : 'Download'}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

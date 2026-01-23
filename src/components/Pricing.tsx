import { useState, useEffect } from 'react'
import { getCurrentUser, loginWithDiscord, clearUser, checkSubscription } from '../utils/auth'
import { createCheckoutSession, redirectToCheckout } from '../utils/stripe'
import type { DiscordUser } from '../utils/auth'

interface PricingOption {
  id: string
  name: string
  price: number
  priceId: string
  features: string[]
  savingsPercent?: number
  isPopular?: boolean
}

const pricingOptions: PricingOption[] = [
  {
    id: '1-month',
    name: '1 Month',
    price: 2.99,
    priceId: 'price_xxxxx', // TODO: Replace with your Stripe Price ID
    features: ['All Pro Features', 'Monthly Updates', 'Priority Support']
  },
  {
    id: '3-month',
    name: '3 Months',
    price: 7.99,
    priceId: 'price_xxxxx', // TODO: Replace with your Stripe Price ID
    features: ['All Pro Features', 'Quarterly Updates', 'Priority Support'],
    savingsPercent: 11,
    isPopular: true
  },
  {
    id: '6-month',
    name: '6 Months',
    price: 13.99,
    priceId: 'price_xxxxx', // TODO: Replace with your Stripe Price ID
    features: ['All Pro Features', 'Bi-Annual Updates', 'Priority Support'],
    savingsPercent: 22
  }
]

export default function Pricing() {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        checkSubscription(currentUser.id).then(isSubscribed => {
          setUser({ ...currentUser, subscribed: isSubscribed })
        })
      } else {
        setUser(null)
      }
      setCheckingAuth(false)
    }

    loadUser()

    // Listen for auth changes
    window.addEventListener('userAuthChange', loadUser)
    return () => {
      window.removeEventListener('userAuthChange', loadUser)
    }
  }, [])

  const handleSubscribe = async (option: PricingOption) => {
    try {
      setLoading(true)
      let currentUser = getCurrentUser()
      
      if (!currentUser) {
        sessionStorage.setItem('pending_price_id', option.priceId)
        loginWithDiscord()
        return
      }

      const checkoutUrl = await createCheckoutSession(currentUser.id, option.priceId)
      redirectToCheckout(checkoutUrl)
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    loginWithDiscord()
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
    // Dispatch event to update Navbar
    window.dispatchEvent(new Event('userAuthChange'))
  }

  if (checkingAuth) {
    return <div>Loading...</div>
  }

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Pricing</h2>
        {user && (
          <div className="user-info" style={{ marginBottom: '20px', padding: '10px', background: 'rgba(30, 30, 47, 0.4)', borderRadius: '8px', color: 'var(--text-primary)' }}>
            <p>Logged in as: <strong>{user.username}</strong></p>
            {user.subscribed && <p style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ Subscribed</p>}
            <button onClick={handleLogout} className="pricing-cta" style={{ marginTop: '10px', width: 'auto' }}>Logout</button>
          </div>
        )}
        <div className="pricing-grid">
          {pricingOptions.map((option) => (
            <div key={option.id} className={`pricing-card ${option.isPopular ? 'popular' : ''}`}>
              {option.isPopular && (
                <div className="popular-badge">Most Popular</div>
              )}
              {option.savingsPercent && (
                <div className="discount-badge">Save {option.savingsPercent}%</div>
              )}
              <div className="pricing-header">
                <h3 className="pricing-name">{option.name}</h3>
                <div className="pricing-price">
                  <div className="price-amount">${option.price}</div>
                </div>
              </div>
              <ul className="pricing-features-list" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                {option.features.map((feature, idx) => (
                  <li key={idx} className="feature-item" style={{ marginBottom: '0.5rem' }}>
                    <span>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(option)}
                disabled={loading}
                className={`pricing-cta ${option.isPopular ? 'popular' : ''}`}
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Processing...' : user ? 'Subscribe' : 'Login to Subscribe'}
              </button>
            </div>
          ))}
        </div>
        {!user && (
          <div className="pricing-footer">
            <button 
              onClick={handleLogin} 
              className="pricing-cta"
              style={{ width: 'auto', display: 'inline-block' }}
            >
              Login with Discord
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
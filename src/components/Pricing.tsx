import { useState } from 'react'
import { loginWithDiscord } from '../utils/auth'
import { createCheckoutSession, redirectToCheckout } from '../utils/stripe'
import { useSubscription } from '../hooks/useSubscription'

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
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '', // No price ID for free tier
    features: ['Basic Statistics', 'Match History', 'Character Tracking', 'Community Support']
  },
  {
    id: '1-month',
    name: 'Pro - 1 Month',
    price: 2.99,
    priceId: 'price_xxxxx', // TODO: Replace with your Stripe Price ID
    features: ['Death Logs', 'CC Timelines', 'Resists & Misses', 'Monthly Updates', 'Priority Support']
  },
  {
    id: '3-month',
    name: 'Pro - 3 Months',
    price: 7.99,
    priceId: 'price_xxxxx', // TODO: Replace with your Stripe Price ID
    features: ['Death Logs', 'CC Timelines', 'Resists & Misses', 'Quarterly Updates', 'Priority Support'],
    savingsPercent: 11,
    isPopular: true
  }
]

export default function Pricing() {
  const { user, isLoading: checkingAuth } = useSubscription()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (option: PricingOption) => {
    try {
      setLoading(true)
      
      // Free tier - just download or show message
      if (option.id === 'free') {
        // Redirect to download or show free tier info
        const downloadLink = document.querySelector('a[href*="releases"]') as HTMLAnchorElement
        if (downloadLink) {
          downloadLink.click()
        } else {
          window.location.href = 'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'
        }
        setLoading(false)
        return
      }
      
      if (!user) {
        sessionStorage.setItem('pending_price_id', option.priceId)
        loginWithDiscord()
        return
      }

      const checkoutUrl = await createCheckoutSession(user.id, option.priceId)
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


  if (checkingAuth) {
    return <div>Loading...</div>
  }

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Pricing</h2>
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
                  {option.price === 0 ? (
                    <div className="price-amount">Free</div>
                  ) : (
                    <>
                      <div className="price-amount">${option.price}</div>
                      {option.id === '1-month' && (
                        <div className="price-breakdown" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          billed monthly
                        </div>
                      )}
                      {option.id === '3-month' && (
                        <div className="price-breakdown" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          billed every 3 months
                        </div>
                      )}
                    </>
                  )}
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
                className={`pricing-cta ${option.isPopular ? 'popular' : ''} ${option.id === 'free' ? 'free-tier' : ''}`}
                style={{ 
                  opacity: loading ? 0.6 : 1, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  ...(option.id === 'free' ? { background: 'rgba(74, 222, 128, 0.1)', borderColor: 'rgba(74, 222, 128, 0.3)' } : {})
                }}
              >
                {loading ? 'Processing...' : option.id === 'free' ? 'Download Free' : user ? 'Subscribe' : 'Login to Subscribe'}
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
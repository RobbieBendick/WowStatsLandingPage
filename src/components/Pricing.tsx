import { useState } from 'react'
import { loginWithDiscord } from '../utils/auth'
import { createCheckoutSession, redirectToCheckout } from '../utils/stripe'
import { useSubscription } from '../hooks/useSubscription'

interface PricingOption {
  id: string
  name: string
  price: number
  priceId: string
  paymentLink?: string // Stripe Payment Link URL (alternative to priceId)
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
    priceId: import.meta.env.VITE_ONE_MONTH_PRICE_ID,
    // paymentLink: import.meta.env.VITE_ONE_MONTH_PAYMENT_LINK, // Optional: Use payment link instead
    features: ['Death Logs', 'CC Timelines', 'Resists & Misses', 'Monthly Updates', 'Priority Support'],
    isPopular: true
  },
  {
    id: '3-month',
    name: 'Pro - 3 Months',
    price: 7.99,
    priceId: import.meta.env.VITE_THREE_MONTH_PRICE_ID,
    // paymentLink: import.meta.env.VITE_THREE_MONTH_PAYMENT_LINK,
    features: ['Death Logs', 'CC Timelines', 'Resists & Misses', 'Quarterly Updates', 'Priority Support'],
    savingsPercent: 11
  }
]

export default function Pricing() {
  const { user, isLoading: checkingAuth, isSubscribed } = useSubscription()
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

      // Require login before proceeding
      if (!user) {
        // Store the payment link or price ID to use after login
        if (option.paymentLink) {
          sessionStorage.setItem('pending_payment_link', option.paymentLink)
        } else if (option.priceId) {
          sessionStorage.setItem('pending_price_id', option.priceId)
        }
        loginWithDiscord()
        return
      }

      // If payment link is available, use it directly (simpler approach)
      if (option.paymentLink) {
        window.location.href = option.paymentLink
        return
      }
      
      // Validate price ID exists for checkout session approach
      if (!option.priceId || option.priceId.trim() === '') {
        alert('Price ID is missing. Please contact support.')
        console.error('Price ID is missing for option:', option.id)
        setLoading(false)
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
                className={`pricing-cta ${option.isPopular ? 'popular' : ''}`}
                style={{ 
                  opacity: loading ? 0.6 : 1, 
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : option.id === 'free' ? 'Download Free' : isSubscribed ? 'Already Subscribed' : 'Subscribe'}
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
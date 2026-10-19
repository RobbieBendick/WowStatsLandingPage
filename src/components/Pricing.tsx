import { useState } from 'react';
import { loginWithDiscord } from '../utils/auth';
import { createCheckoutSession, redirectToCheckout } from '../utils/stripe';
import { useSubscription } from '../hooks/useSubscription';

interface PricingOption {
  id: string;
  name: string;
  price: number;
  priceId: string;
  paymentLink?: string; // Stripe Payment Link URL (alternative to priceId)
  features: string[];
  audience: string;
  billing: string;
  icon: 'free' | 'month' | 'season';
  originalPrice?: number;
  savingsPercent?: number;
  isPopular?: boolean;
}

const proFeatures = [
  'Auto Arena Recording',
  'Death Log',
  'Timeline',
  'Trinket Tracking',
];

const pricingOptions: PricingOption[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '', // No price ID for free tier
    audience: 'For getting started',
    billing: 'no subscription',
    icon: 'free',
    features: [
      'Match History',
      'Matchup Analysis',
      'Spell Analysis',
      'Character Tracking',
    ],
  },
  {
    id: '1-month',
    name: 'Pro · 1 Month',
    price: 2.99,
    priceId: import.meta.env.VITE_ONE_MONTH_PRICE_ID,
    // paymentLink: import.meta.env.VITE_ONE_MONTH_PAYMENT_LINK, // Optional: Use payment link instead
    audience: 'For active climbers',
    billing: 'per month, billed monthly',
    icon: 'month',
    features: proFeatures,
    isPopular: true,
  },
  {
    id: '3-month',
    name: 'Pro · 3 Months',
    price: 7.99,
    originalPrice: 9,
    priceId: import.meta.env.VITE_THREE_MONTH_PRICE_ID,
    // paymentLink: import.meta.env.VITE_THREE_MONTH_PAYMENT_LINK,
    audience: 'For the full season',
    billing: 'billed every 3 months',
    icon: 'season',
    features: proFeatures,
    savingsPercent: 11,
  },
];

function PlanIcon({ icon }: { icon: PricingOption['icon'] }) {
  if (icon === 'month') {
    return (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'>
        <path d='M12 3.2 20.2 8v8L12 20.8 3.8 16V8L12 3.2Z' strokeLinejoin='round' />
        <path d='M12 12.2 20.2 8M12 12.2v8.6M12 12.2 3.8 8' strokeLinejoin='round' />
      </svg>
    );
  }

  if (icon === 'season') {
    return (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'>
        <path d='M12 3.5 20.5 8 12 12.5 3.5 8 12 3.5Z' strokeLinejoin='round' />
        <path d='M3.5 12 12 16.5 20.5 12' strokeLinejoin='round' />
        <path d='M3.5 16 12 20.5 20.5 16' strokeLinejoin='round' />
      </svg>
    );
  }

  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'>
      <circle cx='12' cy='12' r='3' />
      <path
        d='M12 3.2v2.2M12 18.6V21M3.2 12h2.2M18.6 12H21M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className='feature-check' viewBox='0 0 16 16' aria-hidden='true'>
      <rect x='1.2' y='1.2' width='13.6' height='13.6' rx='4' />
      <path d='M4.6 8.2 6.9 10.4 11.5 5.7' />
    </svg>
  );
}

export default function Pricing() {
  const { user, isLoading: checkingAuth, isSubscribed } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (option: PricingOption) => {
    if (loading || isSubscribed) {
      return;
    }

    try {
      setLoading(true);

      // Free tier - just download or show message
      if (option.id === 'free') {
        // Redirect to download or show free tier info
        const downloadLink = document.querySelector(
          'a[href*="releases"]',
        ) as HTMLAnchorElement;
        if (downloadLink) {
          downloadLink.click();
        } else {
          window.location.href =
            'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest';
        }
        setLoading(false);
        return;
      }

      // Require login before proceeding
      if (!user) {
        // Store the payment link or price ID to use after login
        if (option.paymentLink) {
          sessionStorage.setItem('pending_payment_link', option.paymentLink);
        } else if (option.priceId) {
          sessionStorage.setItem('pending_price_id', option.priceId);
        }
        loginWithDiscord();
        return;
      }

      // If payment link is available, use it directly (simpler approach)
      if (option.paymentLink) {
        window.location.href = option.paymentLink;
        return;
      }

      // Validate price ID exists for checkout session approach
      if (!option.priceId || option.priceId.trim() === '') {
        alert('Price ID is missing. Please contact support.');
        console.error('Price ID is missing for option:', option.id);
        setLoading(false);
        return;
      }

      const checkoutUrl = await createCheckoutSession(user.id, option.priceId);
      redirectToCheckout(checkoutUrl);
    } catch (error) {
      console.error('Subscription error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to start subscription. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <section id='pricing' className='pricing'>
        <div className='pricing-loading'>
          <div className='pricing-loading-card'>
            <div className='pricing-loading-spinner' aria-hidden />
            <p className='pricing-loading-text'>Loading pricing</p>
            <p className='pricing-loading-subtext'>Checking your subscription…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='pricing' className='pricing'>
      <div className='container'>
        <h2 className='section-title'>Pricing</h2>
        <p className='section-subtitle'>
          Start free, then unlock arena recording, timelines, and the rest of the Pro tools.
        </p>
        <div className='pricing-grid'>
          {pricingOptions.map(option => (
            <div
              key={option.id}
              className={`pricing-card ${option.isPopular ? 'popular' : ''}`}
            >
              {option.savingsPercent ? (
                <div className='pricing-ribbon'>
                  Save {option.savingsPercent}%
                </div>
              ) : null}
              <div className='pricing-card-icon'>
                <PlanIcon icon={option.icon} />
              </div>
              <h3 className='pricing-name'>{option.name}</h3>
              <div className='pricing-price'>
                <div className='price-row'>
                  <span className='price-amount'>
                    $
                    {option.price === 0 ? '0' : option.price.toFixed(2)}
                  </span>
                  {option.originalPrice != null ? (
                    <span className='price-original'>
                      ${option.originalPrice.toFixed(2)}
                    </span>
                  ) : null}
                  {option.isPopular ? (
                    <span className='popular-badge'>Recommended</span>
                  ) : null}
                </div>
                <div className='price-breakdown'>{option.billing}</div>
              </div>
              <p className='pricing-audience'>{option.audience}</p>
              <ul className='pricing-features-list'>
                {option.features.map((feature, idx) => (
                  <li key={idx} className='feature-item'>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(option)}
                disabled={loading || isSubscribed}
                className={`pricing-cta ${option.isPopular ? 'popular' : ''}`}
              >
                {loading
                  ? 'Processing...'
                  : option.id === 'free'
                    ? 'Download Free'
                    : isSubscribed
                      ? 'Already Subscribed'
                      : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

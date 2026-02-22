// Stripe utility functions
// Install: npm install @stripe/stripe-js

import { loadStripe } from '@stripe/stripe-js';
import { authFetch } from './auth';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

type StripeInstance = Awaited<ReturnType<typeof loadStripe>>;
let stripePromise: Promise<StripeInstance> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn(
        'Stripe publishable key not found. Set VITE_STRIPE_PUBLISHABLE_KEY in .env',
      );
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Create checkout session via backend (sends session so backend can verify user)
export const createCheckoutSession = async (
  userId: string,
  priceId: string,
) => {
  const response = await authFetch(`${API_URL}/api/stripe/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      price_id: priceId,
      client: 'web',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create checkout: ${error}`);
  }

  const data = await response.json();
  return data.url; // Returns the Stripe Checkout URL
};

// Redirect to checkout URL
export const redirectToCheckout = async (checkoutUrl: string) => {
  window.location.href = checkoutUrl;
};

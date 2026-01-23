# Stripe Subscription Integration Guide

This guide shows you how to integrate Stripe subscriptions with your WowStats pricing component.

## Step 1: Install Stripe

```bash
npm install @stripe/stripe-js
```

## Step 2: Create Backend API Endpoint

You'll need a backend server (Node.js/Express, Python/Flask, etc.) to handle Stripe securely.

### Example: Node.js/Express Backend

```javascript
// server.js or api/create-checkout-session.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  const { months, price } = req.body;
  
  try {
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'WowStats Pro Subscription',
              description: `${months} month${months > 1 ? 's' : ''} subscription`,
            },
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        // Set billing cycle anchor to handle multi-month prepayments
        billing_cycle_anchor: Math.floor(Date.now() / 1000) + (months * 30 * 24 * 60 * 60),
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      metadata: {
        months: months.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle subscription events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Activate user's subscription
      // Update your database with subscription status
      console.log('Subscription activated for:', session.customer);
      break;
    
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled');
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
```

## Step 3: Update Pricing Component

Update your `Pricing.tsx` component to call your backend:

```typescript
// In src/components/Pricing.tsx

const handleSubscribe = async (option: PricingOption) => {
  try {
    // Show loading state
    setLoading(true);
    
    // Call your backend API
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        months: option.months,
        price: option.totalPrice,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }
  } catch (error) {
    console.error('Subscription error:', error);
    // Show error message to user
    alert('Failed to start subscription. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Step 4: Add Environment Variables

Create a `.env` file in your project root (for Vite):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001/api
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

For your backend (separate `.env` file):
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 5: Create Success Page

Create a success page component:

```typescript
// src/components/Success.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Verify payment and activate subscription
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          // Update user's subscription status
          console.log('Subscription verified:', data);
        });
    }
  }, [sessionId]);

  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>Your subscription is now active. You can start using all Pro features.</p>
      <a href="/">Return to App</a>
    </div>
  );
}
```

## Alternative: Simpler One-Time Payment for Multi-Month Plans

If you want to handle multi-month plans as one-time payments instead of subscriptions:

```javascript
app.post('/api/create-payment-session', async (req, res) => {
  const { months, price } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `WowStats Pro - ${months} Month${months > 1 ? 's' : ''}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // One-time payment
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/pricing`,
    metadata: {
      months: months.toString(),
      expires_at: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  res.json({ sessionId: session.id });
});
```

## Step 6: Update Your App to Check Subscription Status

In your main app, check if user has active subscription:

```typescript
// Check subscription status
const checkSubscription = async () => {
  const response = await fetch('/api/subscription-status', {
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  });
  
  const { isActive, expiresAt } = await response.json();
  return { isActive, expiresAt };
};
```

## Testing

1. Use Stripe test mode: `pk_test_...` and `sk_test_...`
2. Test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Use test email: any email works in test mode

## Security Notes

- Never expose secret keys in frontend code
- Always validate payments on backend
- Use HTTPS in production
- Verify webhook signatures
- Store subscription status in your database

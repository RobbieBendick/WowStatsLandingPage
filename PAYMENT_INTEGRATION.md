# Payment Integration Guide

This guide explains how to integrate a subscription/payment system with the WowStats landing page.

## Current Implementation

The pricing component (`src/components/Pricing.tsx`) includes a `handleSubscribe` function that currently logs to console. You'll need to integrate with a payment processor.

## Payment Options

### Option 1: Stripe (Recommended)

Stripe is the most popular payment processor for subscriptions.

1. **Install Stripe:**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Create a Checkout Session:**
   ```typescript
   // In your backend API
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       price_data: {
         currency: 'usd',
         product_data: { name: 'WowStats Pro' },
         recurring: { interval: 'month' },
         unit_amount: 999, // $9.99
       },
       quantity: 1,
     }],
     mode: 'subscription',
     success_url: 'https://yourdomain.com/success',
     cancel_url: 'https://yourdomain.com/pricing',
   });
   ```

3. **Update Pricing Component:**
   ```typescript
   const handleSubscribe = async (tier: PricingTier) => {
     const response = await fetch('/api/create-checkout-session', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ plan: tier.name.toLowerCase() }),
     });
     const { sessionId } = await response.json();
     const stripe = await loadStripe('your-publishable-key');
     await stripe?.redirectToCheckout({ sessionId });
   };
   ```

### Option 2: PayPal

1. **Install PayPal SDK:**
   ```bash
   npm install @paypal/react-paypal-js
   ```

2. **Add PayPal Buttons:**
   ```typescript
   import { PayPalButtons } from '@paypal/react-paypal-js';

   <PayPalButtons
     createOrder={(data, actions) => {
       return actions.order.create({
         purchase_units: [{
           amount: { value: '9.99' }
         }]
       });
     }}
     onApprove={(data, actions) => {
       return actions.order.capture().then(details => {
         // Handle successful payment
       });
     }}
   />
   ```

### Option 3: Custom Payment API

If you have your own payment backend:

```typescript
const handleSubscribe = async (tier: PricingTier) => {
  try {
    const response = await fetch('https://your-api.com/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: tier.name,
        price: tier.price,
        userId: getCurrentUserId(), // Your auth logic
      }),
    });
    
    if (response.ok) {
      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

## Subscription Management

After payment, you'll need to:

1. **Store subscription status** (database, localStorage, or auth token)
2. **Check subscription** on app launch
3. **Handle subscription updates** (upgrade/downgrade/cancel)
4. **Webhook handling** for payment events (Stripe webhooks, PayPal IPN)

## Example Backend Endpoint (Node.js/Express)

```javascript
app.post('/api/create-checkout-session', async (req, res) => {
  const { plan } = req.body;
  
  const prices = {
    pro: 'price_pro_monthly',
    lifetime: 'price_lifetime',
  };
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: prices[plan], quantity: 1 }],
    mode: plan === 'lifetime' ? 'payment' : 'subscription',
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/pricing`,
  });
  
  res.json({ sessionId: session.id });
});
```

## Security Considerations

- Never expose API keys in frontend code
- Always validate payments on the backend
- Use HTTPS for all payment operations
- Implement proper error handling
- Add loading states during payment processing

## Testing

- Use Stripe test mode: `pk_test_...`
- Use PayPal sandbox for testing
- Test all subscription flows (success, cancel, error)

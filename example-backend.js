// Example Backend Server (Node.js/Express)
// This is a reference implementation - adapt to your backend framework

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { months, price, monthlyPrice } = req.body;

    // Validate input
    if (!months || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Stripe Checkout Session
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
            // For multi-month plans, you can either:
            // Option 1: One-time payment (simpler)
            unit_amount: Math.round(price * 100), // Convert dollars to cents
            // Option 2: Recurring subscription (more complex, requires handling billing cycles)
            // recurring: {
            //   interval: 'month',
            //   interval_count: 1,
            // },
          },
          quantity: 1,
        },
      ],
      // Use 'payment' for one-time payments (recommended for multi-month plans)
      mode: 'payment',
      // Or use 'subscription' for recurring monthly billing
      // mode: 'subscription',
      
      success_url: `${req.headers.origin || 'http://localhost:5174'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5174'}/#pricing`,
      metadata: {
        months: months.toString(),
        monthlyPrice: monthlyPrice.toString(),
        totalPrice: price.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment session (for success page)
app.get('/api/verify-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      // Activate subscription in your database
      // Update user's subscription status based on session.metadata.months
      
      res.json({
        success: true,
        months: parseInt(session.metadata.months),
        expiresAt: new Date(Date.now() + parseInt(session.metadata.months) * 30 * 24 * 60 * 60 * 1000),
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint (for production - handles subscription events)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Activate subscription
      console.log('Payment successful:', session.id);
      // TODO: Update database with subscription
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

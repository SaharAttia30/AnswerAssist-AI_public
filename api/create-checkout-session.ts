// api/create-checkout-session.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const SITE_URL = process.env.VITE_SITE_URL || 'https://answerassistai.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, billingPeriod, userId } = req.body as {
      planId?: string;
      billingPeriod?: 'monthly' | 'annual';
      userId?: string;
    };

    if (!planId || !userId) {
      return res.status(400).json({ error: 'Missing planId or userId' });
    }

    let priceId: string | undefined;
    switch (planId) {
      case 'solo':
        priceId = process.env.STRIPE_PRICE_SOLO_ID;
        break;
      case 'business':
        priceId = process.env.STRIPE_PRICE_BUSINESS_ID;
        break;
      case 'enterprise':
        priceId = process.env.STRIPE_PRICE_ENTERPRISE_ID;
        break;
      case 'trial':
        return res.status(400).json({ error: 'Trial does not need Stripe payment' });
      default:
        return res.status(400).json({ error: 'Unknown planId' });
    }

    if (!priceId) {
      return res.status(500).json({ error: 'Stripe price not configured for this plan' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?checkout=cancel`,
      client_reference_id: userId,
      metadata: {
        type: 'plan',
        userId,
        planId,
        billingPeriod: billingPeriod || 'monthly',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

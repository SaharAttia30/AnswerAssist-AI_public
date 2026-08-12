// api/top-up-minutes.ts
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
    const { userId, minutes, minutes_price } = req.body as {
      userId: string;
      minutes: number;
      minutes_price: string;
    };

    if (!userId || !minutes || !minutes_price) {
      return res.status(400).json({ error: 'Missing userId, minutes or minutes_price' });
    }

    const amountInCents = Math.round(Number(minutes_price) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountInCents,
            product_data: {
              name: `${minutes} AnswerAssist AI minutes`,
            },
          },
        },
      ],
      success_url: `${SITE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?checkout=cancel`,
      client_reference_id: userId,
      metadata: {
        type: 'topup',
        userId,
        minutes: String(minutes),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

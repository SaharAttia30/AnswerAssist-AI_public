// api/stripe-webhook.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function MinutesToSetByPlanId(plan_id : string): string{
    const map : Record<string, string> = {
        "solo" : "500",
        "business" : "2000",
        "enterprise" : "5500"
    };
    return map[plan_id];
}
export const config = {
  api: {
    bodyParser: false,
  },
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
function addOneMonth(date: Date): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}
function toInt(value: string): number {
  const num = parseInt(value, 10);
  return Number.isFinite(num) ? num : 0;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = (session.metadata?.userId as string | undefined) || (session.client_reference_id as string | undefined);
      const planId = session.metadata?.planId as string | undefined;
      const session_type = session.metadata?.type as string | undefined;
      if(session_type=="plan"){
        if (userId && planId) {
          const minutes = MinutesToSetByPlanId(planId);
          const currentPeriodEnd = addOneMonth(new Date());
          // Save/Update the user's plan in Supabase
          const { error } = await supabase
            .from('user_plans')
            .upsert(
              {
                user_id: userId,
                plan_id: planId,
                minutes: minutes,
                stripe_customer_id: session.customer as string | null,
                stripe_subscription_id: session.subscription as string | null,
                status: 'active',
                current_period_end: currentPeriodEnd,
              },
              { onConflict: 'user_id' }
            );

          if (error) {
            console.error('Supabase upsert error:', error.message);
          } else {
            console.log(`Updated plan for user ${userId} to ${planId}`);
          }
        } 
        // else if()
        else {
          console.warn('checkout.session.completed missing userId or planId', {
            userId,
            planId,
          });
        }
      }
      else if(session_type=="topup"){
        const minutes_from_plan = session.metadata?.minutes as string | undefined
        if (userId && minutes_from_plan) {
          const { data: existing, error: fetchErr } = await supabase
            .from("user_plans")
            .select("minutes")
            .eq("user_id", userId)
            .maybeSingle();

          if (fetchErr) {
            console.error("Supabase fetch error during top up:", fetchErr);
          }
          const currentMinutes = toInt(existing?.minutes);
          const addedMinutes = toInt(minutes_from_plan);
          const newMinutes = currentMinutes + addedMinutes;
          const { error } = await supabase
            .from('user_plans')
            .upsert(
              {
                user_id: userId,
                minutes: newMinutes,
              },
              { onConflict: 'user_id' }
            );

          if (error) {
            console.error('Supabase upsert error:', error.message);
          } else {
            console.log(`Updated plan for user ${userId} to ${planId}`);
          }
        } 
        else {
          console.warn('checkout.session.completed missing userId or planId', {
            userId,
            planId,
          });
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook:', err);
    res.status(500).send('Webhook handler failed');
  }
}

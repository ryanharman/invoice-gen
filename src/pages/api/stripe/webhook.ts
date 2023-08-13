/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions */
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';
import { stripe } from '~/server/stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    const typedChunk = chunk as Buffer | string;
    chunks.push(
      typeof typedChunk === "string" ? Buffer.from(typedChunk) : typedChunk
    );
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "customer.subscription.deleted",
]);

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST /api/stripe/webhook – listen to Stripe webhooks
  if (req.method && req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  // Verify webhook signature and extract the event.
  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Break early if not an event we handle
  if (!relevantEvents.has(event.type)) {
    return res.status(400).send(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (
          checkoutSession.client_reference_id === null ||
          checkoutSession.customer === null ||
          checkoutSession.subscription === null
        ) {
          console.log("❌ Missing items in Stripe webhook callback");
          return;
        }

        // We fetch the subscription to get the current billing period end date
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSession.subscription.toString()
        );

        // when the user subscribes to a plan, set their stripe customer ID
        // in the database for easy identification in future webhook events
        await prisma.user.update({
          where: { id: checkoutSession.client_reference_id },
          data: {
            stripeCustomerId: checkoutSession.customer.toString(),
            stripeSubscriptionId: checkoutSession.subscription.toString(),
            billingCycleEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (!invoice?.customer || !invoice?.subscription) {
          console.log("❌ Missing items in Stripe webhook callback");
          return;
        }

        const stripeCustomerId = invoice.customer.toString();
        const stripeSubscriptionId = invoice.subscription.toString();

        // when the user pays an invoice, update the billingCycleEnd to
        // the end of the current billing period
        await prisma.user.update({
          where: { stripeCustomerId },
          data: {
            stripeSubscriptionId,
            billingCycleEnd: new Date(invoice.period_end * 1000),
          },
        });
      }
      case "customer.subscription.deleted": {
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscriptionDeleted.customer.toString();

        // On subscription cancellation, set the stripeCustomerId and stripeSubscriptionId
        // to null in the database
        await prisma.user.update({
          where: { stripeCustomerId },
          data: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          },
        });
      }
      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }
  } catch (error: any) {
    console.log(`❌ Stripe webhook error: ${error.message}`);
    return res
      .status(400)
      .send('Webhook error: "Webhook handler failed. View logs."');
  }

  res.status(200).json({ received: true });
}

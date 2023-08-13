/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";
import { stripe } from "~/server/stripe";
import { PLANS } from "~/server/stripe/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const URL_PREFIX = process.env.VERCEL ?? "http://localhost:3000";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const planId = PLANS[0]?.price.monthly.priceIds[env.NODE_ENV];

    const session = await stripe.checkout.sessions.create({
      success_url: `${URL_PREFIX}/user?tab=billing`,
      cancel_url: `${URL_PREFIX}/user?tab=billing`,
      automatic_tax: { enabled: true },
      mode: "subscription",
      line_items: [{ price: planId, quantity: 1 }],
      payment_method_types: ["card", "paypal"],
      client_reference_id: ctx.session.user.id,
      customer_email: ctx.session.user.email ?? undefined,
    });

    return session.url;
  }),
  getSubscriptionInfo: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .query(async ({ input }) => {
      const subscription = (await stripe.subscriptions.retrieve(
        input.subscriptionId
      )) as Stripe.Subscription;

      return subscription;
    }),
});

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import Stripe from 'stripe';
import { env } from '~/env.mjs';

const STRIPE_KEY =
  env.STRIPE_KEY_LIVE ?? env.STRIPE_KEY_TEST ?? "No key found chief 🤠";

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
  appInfo: {
    name: "Rynvoice",
    version: "0.1.0",
  },
});

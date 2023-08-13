import { createTRPCRouter } from '~/server/api/trpc';
import { analyticsRouter } from './routers/analytics';
import { defaultsRouter } from './routers/defaults';
import { invoicesRouter } from './routers/invoices';
import { meRouter } from './routers/me';
import { paymentRouter } from './routers/payment';
import { stripeRouter } from './routers/stripe';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  me: meRouter,
  invoices: invoicesRouter,
  invoiceDefaults: defaultsRouter,
  analytics: analyticsRouter,
  payments: paymentRouter,
  stripe: stripeRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

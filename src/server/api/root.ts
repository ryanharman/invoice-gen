import { createTRPCRouter } from "~/server/api/trpc";
import { analyticsRouter } from "./routers/analytics";
import { defaultsRouter } from "./routers/defaults";
import { invoicesRouter } from "./routers/invoices";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  invoices: invoicesRouter,
  invoiceDefaults: defaultsRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

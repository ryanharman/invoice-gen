import { createTRPCRouter, publicProcedure } from "../trpc";

export const meRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => ctx.session),
});

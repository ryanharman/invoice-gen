import { InvoiceDefaultSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const defaultsRouter = createTRPCRouter({
  getUserDefaults: protectedProcedure.query(async ({ ctx }) => {
    const defaults = await ctx.prisma.userDefaultInvoiceValues.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return defaults;
  }),
  upsert: protectedProcedure
    .input(InvoiceDefaultSchema)
    .mutation(async ({ ctx, input }) => {
      const defaults = await ctx.prisma.userDefaultInvoiceValues.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: { ...input, userId: ctx.session.user.id },
      });
      return defaults;
    }),
});

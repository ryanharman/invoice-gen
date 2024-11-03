import { z } from 'zod';
import { decryptPaymentDetails } from '~/server/utils/encryptPaymentDetails';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const paymentRouter = createTRPCRouter({
  getByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input, ctx }) => {
      const [id, key] = input.key.split("-");
      const payment = await ctx.prisma.invoicePayment.findUniqueOrThrow({
        where: { invoiceId: id },
        include: { invoice: { include: { items: true } } },
      });

      if (payment.key !== key) throw new Error("Invalid key");

      const invoiceWithDecryptedValues = await decryptPaymentDetails(
        payment.invoice
      );
      return { ...payment, invoice: invoiceWithDecryptedValues };
    }),
  create: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payment = await ctx.prisma.invoicePayment.create({
        data: { invoice: { connect: { id: input.invoiceId } } },
      });
      return payment;
    }),
  toggleViewed: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currPayment = await ctx.prisma.invoicePayment.findUniqueOrThrow({
        where: { id: input.id },
      });

      if (currPayment.viewedDate) return;

      const payment = await ctx.prisma.invoicePayment.update({
        where: { id: input.id },
        data: { viewedDate: new Date() },
      });
      return payment;
    }),
});

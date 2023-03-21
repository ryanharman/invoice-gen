import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const invoicesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        status: z.string(),
        companyName: z.string(),
        companyEmail: z.string(),
        companyAddress: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerAddress: z.string(),
        invoiceNumber: z.string(),
        invoiceDate: z.string(),
        accountName: z.string(),
        accountNumber: z.string(),
        sortCode: z.string(),
        paymentTerms: z.string(),
        items: z
          .array(
            z.object({
              title: z.string(),
              amount: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const dataObject = {
        status: input.status,
        companyName: input.companyName,
        companyEmail: input.companyEmail,
        companyAddress: input.companyAddress,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerAddress: input.customerAddress,
        invoiceNumber: input.invoiceNumber,
        invoiceDate: input.invoiceDate,
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        sortCode: input.sortCode,
        paymentTerms: input.paymentTerms,
      };

      const items = input.items?.map((item) => ({
        title: item.title,
        amount: Number(item.amount),
      }));

      const invoice = await ctx.prisma.invoice.create({
        data: {
          ...dataObject,
          items: { create: items },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      return invoice;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const invoices = await ctx.prisma.invoice.findMany({
      where: { userId: ctx.session.user.id },
    });
    return invoices;
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
      return invoice;
    }),
});

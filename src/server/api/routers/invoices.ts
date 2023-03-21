import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { InvoiceSchema } from '~/server/schemas';

/**
 * TODO: Revisit object schema to reduce duplication
 * and unnecessary code. Maybe { invoice: { ... }, invoiceItems: [ ... ]}
 */

export const invoicesRouter = createTRPCRouter({
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
  create: protectedProcedure
    .input(InvoiceSchema)
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
  // update: protectedProcedure
  //   .input(InvoiceSchema.partial())
  //   .mutation(async ({ input, ctx }) => {
  //     const invoice = await ctx.prisma.invoice.update({
  //       where: { id: input.id },
  //       data: ...input,
  //     });
  //     return invoice;
  //   }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.delete({
        where: { id: input.id },
      });
      return invoice;
    }),
});

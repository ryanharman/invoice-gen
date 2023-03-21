import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { InvoiceItemSchema, InvoiceSchema } from '~/server/schemas';

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
    .input(
      z.object({
        invoice: InvoiceSchema,
        items: InvoiceItemSchema.array().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const items = input.items?.map((item) => ({
        title: item.title,
        amount: Number(item.amount),
      }));

      const invoice = await ctx.prisma.invoice.create({
        data: {
          ...input.invoice,
          items: { create: items },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      return invoice;
    }),
  update: protectedProcedure
    .input(
      z.object({
        invoice: InvoiceSchema.partial().extend({
          id: z.string(),
        }),
        items: InvoiceItemSchema.extend({
          id: z.string(),
        })
          .array()
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.update({
        where: { id: input.invoice.id },
        data: {
          ...input.invoice,
          items: {
            upsert: input.items?.map((item) => ({
              where: { id: item.id },
              create: { ...item, amount: Number(item.amount) },
              update: { ...item, amount: Number(item.amount) },
            })),
          },
        },
      });
      return invoice;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.delete({
        where: { id: input.id },
      });
      return invoice;
    }),
});

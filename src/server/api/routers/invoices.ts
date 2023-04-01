import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  InvoiceItemSchema,
  InvoiceSchema,
  UpdateInvoiceSchema,
} from "~/server/schemas";
import {
  decryptPaymentDetails,
  encryptPaymentDetails,
} from "~/server/utils/encryptPaymentDetails";

export const invoicesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const invoices = await ctx.prisma.invoice.findMany({
      where: { userId: ctx.session.user.id },
    });
    const invoicesWithDecryptedValues = await Promise.all(
      invoices.map((invoice) => decryptPaymentDetails(invoice))
    );
    console.log({ invoicesWithDecryptedValues });
    return invoicesWithDecryptedValues;
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
      const invoiceWithDecryptedValues = await decryptPaymentDetails(invoice);
      return invoiceWithDecryptedValues;
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

      const invoiceWithEncryptedValues = await encryptPaymentDetails(
        input.invoice
      );

      const invoice = await ctx.prisma.invoice.create({
        data: {
          ...invoiceWithEncryptedValues,
          items: { create: items },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      return invoice;
    }),
  update: protectedProcedure
    .input(
      z.object({
        invoice: UpdateInvoiceSchema,
        items: InvoiceItemSchema.extend({
          id: z.string(),
        })
          .array()
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoiceWithEncryptedValues = await encryptPaymentDetails(
        input.invoice
      );

      const invoice = await ctx.prisma.invoice.update({
        where: { id: input.invoice.id },
        data: {
          ...invoiceWithEncryptedValues,
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

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sendInvoiceEmail } from "~/server/nodemailer";
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
  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const invoices = await ctx.prisma.invoice.findMany({
        where: { userId: ctx.session.user.id },
        take: input?.limit,
      });
      const invoicesWithDecryptedValues = await Promise.all(
        invoices.map((invoice) => decryptPaymentDetails(invoice))
      );
      return invoicesWithDecryptedValues;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUniqueOrThrow({
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
          id: z.string().optional(),
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
        data: invoiceWithEncryptedValues,
      });

      if (!input.items) return invoice;

      // Upserts are cringe anyways who cares if
      // prisma doesn't properly support them!!
      // (or am i too stupid to use them right?)
      await Promise.all(
        input.items?.map(async (item) => {
          if (item.id) {
            return await ctx.prisma.invoiceItem.update({
              where: { id: item.id },
              data: { ...item, amount: Number(item.amount) },
            });
          }
          return await ctx.prisma.invoiceItem.create({
            data: {
              ...item,
              amount: Number(item.amount),
              invoiceId: invoice.id,
            },
          });
        })
      );

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
  getLatestInvoiceNumber: protectedProcedure.query(async ({ ctx }) => {
    const latestInvoice = await ctx.prisma.invoice.findFirst({
      orderBy: { invoiceNumber: "desc" },
    });
    const latestNumber = latestInvoice?.invoiceNumber ?? 0;
    return latestNumber + 1;
  }),
  hasBeenSent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const payment = await ctx.prisma.invoicePayment.findFirst({
        where: { invoiceId: input.id },
      });
      return !!payment;
    }),
  sendInvoice: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const key = Math.random().toString(36).substring(2, 34);
      const payment = await ctx.prisma.invoicePayment.create({
        data: { invoiceId: input.id, key },
        include: { invoice: true },
      });

      sendInvoiceEmail({
        key: `${input.id}-${key}`,
        companyName: payment.invoice.companyName,
        emailFrom: payment.invoice.companyEmail,
        emailTo: payment.invoice.customerEmail,
      });

      await ctx.prisma.invoice.update({
        where: { id: input.id },
        data: { status: "Unpaid" },
      });
    }),
});

import { add, format, startOfMonth, startOfYear, sub } from "date-fns";
import { z } from "zod";
import { Invoice, InvoiceItem } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type InvoiceWithItems = {
  items: InvoiceItem[];
} & Invoice;

function calculateInvoiceTotal(invoices: InvoiceWithItems[]) {
  if (!invoices || invoices.length === 0) return 0;
  return invoices?.reduce(
    (acc, invoice) =>
      acc + invoice.items.reduce((acc, item) => acc + item.amount, 0),
    0
  );
}

const defaultInputZod = z
  .object({
    date: z.date().optional(),
  })
  .optional();

const defaultStartDate = startOfMonth(new Date());

export const analyticsRouter = createTRPCRouter({
  revenue: protectedProcedure
    .input(defaultInputZod)
    .query(async ({ ctx, input }) => {
      const filterBy = input?.date ?? defaultStartDate;
      const selectedMonthInvoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: { gte: filterBy, lt: add(filterBy, { months: 1 }) },
        },
        include: { items: true },
      });
      const revenue = calculateInvoiceTotal(selectedMonthInvoices);

      const previousMonthInvoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: sub(filterBy, { months: 1 }),
            lt: filterBy,
          },
        },
        include: { items: true },
      });
      const previousMonthRevenue = calculateInvoiceTotal(previousMonthInvoices);

      function calculateTrend() {
        if (previousMonthRevenue === 0) {
          return 100;
        }
        if (revenue === 0) {
          return 0;
        }
        return ((revenue - previousMonthRevenue) / previousMonthRevenue) * 100;
      }
      const trend = calculateTrend();

      return {
        revenue,
        trend,
      };
    }),
  averageInvoice: protectedProcedure
    .input(defaultInputZod)
    .query(async ({ ctx, input }) => {
      const filterBy = input?.date ?? defaultStartDate;
      const invoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: filterBy,
            lt: add(filterBy, { months: 1 }),
          },
        },
        include: { items: true },
      });

      function calculateAverage(invoicesToUse: InvoiceWithItems[]) {
        const invoiceTotal = calculateInvoiceTotal(invoicesToUse);
        if (invoiceTotal === 0) {
          return 0;
        }
        return invoiceTotal / invoicesToUse.length;
      }

      const averageInvoice = calculateAverage(invoices);

      const previousMonthInvoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: sub(filterBy, { months: 1 }),
            lt: filterBy,
          },
        },
        include: { items: true },
      });

      const previousMonthAverageInvoice = calculateAverage(
        previousMonthInvoices
      );

      return {
        averageInvoice,
        trend: averageInvoice - previousMonthAverageInvoice,
      };
    }),
  overviewChart: protectedProcedure.query(async ({ ctx }) => {
    const invoices = await ctx.prisma.invoice.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: startOfYear(new Date()),
        },
      },
      include: { items: true },
    });

    const monthlyTotals = invoices.reduce((acc, invoice) => {
      const month = format(invoice.createdAt, "MMM");
      const total = calculateInvoiceTotal([invoice]);
      return { ...acc, [month]: (acc[month] ?? 0) + total };
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals).map(([month, total]) => ({
      name: month,
      total,
    }));
  }),
  totalMonthlyInvoices: protectedProcedure
    .input(defaultInputZod)
    .query(async ({ ctx, input }) => {
      const filterBy = input?.date ?? defaultStartDate;
      const invoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: filterBy,
            lt: add(filterBy, { months: 1 }),
          },
        },
      });

      const previousMonthInvoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: sub(filterBy, { months: 1 }),
          },
        },
      });
      return {
        total: invoices.length,
        trend: invoices.length - previousMonthInvoices.length,
      };
    }),
  totalUnpaidInvoices: protectedProcedure
    .input(defaultInputZod)
    .query(async ({ ctx, input }) => {
      const filterBy = input?.date ?? defaultStartDate;
      const invoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: filterBy,
            lt: add(filterBy, { months: 1 }),
          },
          status: "UNPAID",
        },
        include: { items: true },
      });

      const total = calculateInvoiceTotal(invoices);

      return {
        total: total,
        invoices: invoices.length,
      };
    }),
});

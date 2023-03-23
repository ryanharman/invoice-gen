import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  title: z.string(),
  amount: z.number(),
});

export const InvoiceSchema = z.object({
  status: z.string(),
  companyName: z.string(),
  companyEmail: z.string(),
  companyAddress: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerAddress: z.string(),
  invoiceNumber: z.number(),
  invoiceDate: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
  sortCode: z.string(),
  paymentTerms: z.string(),
});

export const InvoiceSchemaWithItems = InvoiceSchema.extend({
  items: z.array(InvoiceItemSchema).optional(),
});

export const UpdateInvoiceSchema = InvoiceSchema.partial().extend({
  id: z.string(),
});

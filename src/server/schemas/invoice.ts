import { z } from "zod";
import { InvoiceDefaultSchema } from "./invoiceDefault";

export const InvoiceItemSchema = z.object({
  title: z.string(),
  amount: z.number(),
});

export const InvoiceSchema = z
  .object({
    status: z.string(),
    customerName: z.string().nonempty(),
    customerEmail: z.string().nonempty(),
    customerAddress: z.string().optional(),
    invoiceNumber: z.number(),
    invoiceDate: z.date(),
  })
  .merge(InvoiceDefaultSchema);

export type Invoice = z.infer<typeof InvoiceSchema>;

export const InvoiceSchemaWithItems = InvoiceSchema.extend({
  items: z.array(InvoiceItemSchema).optional(),
});

export type InvoiceWithItems = z.infer<typeof InvoiceSchemaWithItems>;

export const UpdateInvoiceSchema = InvoiceSchema.partial().extend({
  id: z.string(),
});

export type UpdateInvoice = z.infer<typeof UpdateInvoiceSchema>;

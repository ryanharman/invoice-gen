import { z } from "zod";

export const InvoiceDefaultSchema = z.object({
  companyName: z.string(),
  companyEmail: z.string(),
  companyAddress: z.string(),
  accountName: z.string(),
  accountNumber: z.number(),
  sortCode: z.number(),
  paymentTerms: z.string(),
});

export type InvoiceDefault = z.infer<typeof InvoiceDefaultSchema>;

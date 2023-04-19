export type InvoiceItem = {
  id?: string;
  title: string;
  amount: number;
};

export type InvoiceItemWithKey = InvoiceItem & { key: number };

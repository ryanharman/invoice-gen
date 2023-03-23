export type InvoiceItem = {
  title: string;
  amount: number;
};

export type InvoiceItemWithKey = InvoiceItem & { key: number };

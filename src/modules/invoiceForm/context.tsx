import { createContext, useContext, useState } from 'react';

export type InvoiceFormState = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  invoiceNumber: number;
  invoiceDate: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  paymentTerms: string;
};

type InvoiceForm = {
  formValue: InvoiceFormState | undefined;
  setFormValues: (value: InvoiceFormState) => void;
};

const InvoiceFormContext = createContext<InvoiceForm | null>(null);

type Props = {
  children: React.ReactNode;
};

export function InvoiceFormProvider({ children }: Props) {
  const [formValue, setFormValues] = useState<InvoiceFormState | undefined>();

  const values: InvoiceForm = {
    formValue,
    setFormValues,
  };

  return (
    <InvoiceFormContext.Provider value={values}>
      {children}
    </InvoiceFormContext.Provider>
  );
}

export function useInvoiceForm() {
  const context = useContext(InvoiceFormContext);

  if (context == null) {
    throw new Error("useInvoiceForm must be used within a InvoiceFormProvider");
  }

  return context;
}

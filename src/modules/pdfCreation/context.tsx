import { createContext, useContext, useState } from "react";

export type PdfCreationState = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  paymentTerms: string;
};

type PdfCreation = {
  formValue: PdfCreationState | undefined;
  setFormValues: (value: PdfCreationState) => void;
};

const PdfCreationContext = createContext<PdfCreation | null>(null);

type Props = {
  children: React.ReactNode;
};

export function PdfCreationProvider({ children }: Props) {
  const [formValue, setFormValues] = useState<PdfCreationState | undefined>();

  const values: PdfCreation = {
    formValue,
    setFormValues,
  };

  return (
    <PdfCreationContext.Provider value={values}>
      {children}
    </PdfCreationContext.Provider>
  );
}

export function usePdfCreation() {
  const context = useContext(PdfCreationContext);

  if (context == null) {
    throw new Error("usePdfCreation must be used within a PdfCreationProvider");
  }

  return context;
}

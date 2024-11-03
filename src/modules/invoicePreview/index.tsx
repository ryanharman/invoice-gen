import { forwardRef } from "react";
import { ErrorBoundary } from "~/components/error-boundary";
import { Contact, ContactProps } from "./Contact";
import { Header, HeaderProps } from "./Header";
import { PaymentDetailProps, PaymentDetails } from "./PaymentDetails";
import { PaymentTerms } from "./PaymentTerms";
import { Table, TableProps } from "./Table";

type Props = {
  header: HeaderProps;
  contactDetails: ContactProps;
  table: TableProps;
  paymentDetails: PaymentDetailProps;
  paymentTerms: string;
};

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(
  ({ header, contactDetails, table, paymentDetails, paymentTerms }, ref) => {
    return (
      <ErrorBoundary>
        <div ref={ref} className="flex w-full max-w-7xl flex-col gap-8">
          <Header {...header} />
          <Contact {...contactDetails} />
          <Table {...table} />
          <PaymentDetails {...paymentDetails} />
          <PaymentTerms terms={paymentTerms} />
        </div>
      </ErrorBoundary>
    );
  }
);
InvoicePreview.displayName = "InvoicePreview";

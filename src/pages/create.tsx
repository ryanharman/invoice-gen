import type { NextPage } from "next";
import { NewLayout } from "~/modules";
import { InvoiceForm } from "~/modules/invoiceForm";

const Create: NextPage = () => {
  return (
    <NewLayout>
      <InvoiceForm />
    </NewLayout>
  );
};

export default Create;

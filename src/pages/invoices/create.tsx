import type { NextPage } from "next";
import { Layout } from "~/components/layout";
import { InvoiceForm } from "~/modules/invoiceForm";

const Create: NextPage = () => {
  return (
    <Layout>
      <InvoiceForm />
    </Layout>
  );
};

export default Create;

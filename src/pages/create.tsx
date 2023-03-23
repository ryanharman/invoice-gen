import type { NextPage } from "next";
import { Layout } from '~/modules';
import { InvoiceForm } from '~/modules/invoiceForm';

const Create: NextPage = () => {
  return (
    <Layout title="Create an invoice">
      <InvoiceForm />
    </Layout>
  );
};

export default Create;

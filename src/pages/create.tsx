import type { NextPage } from "next";
import { Layout } from '~/modules';
import { PdfCreation } from '~/modules/pdfCreation';

const Create: NextPage = () => {
  return (
    <Layout title="Create an invoice">
      <PdfCreation />
    </Layout>
  );
};

export default Create;

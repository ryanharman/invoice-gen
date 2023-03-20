import type { NextPage } from "next";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Layout } from '~/modules';
import { PdfCreation } from '~/modules/pdfCreation';

const Create: NextPage = () => {
  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>Invoice</title>
        <meta name="description" content="Ree anne herman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="Create an invoice">
        <Button
          variant="link"
          className="text-md mb-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => push("/")}
        >
          👈 Go back
        </Button>
        <PdfCreation />
      </Layout>
    </>
  );
};

export default Create;

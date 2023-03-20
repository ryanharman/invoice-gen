import type { NextPage } from "next";
import Head from 'next/head';
import { Invoices, Layout } from '~/modules';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invoice</title>
        <meta name="description" content="Ree anne herman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="Invoices">
        <Invoices />
      </Layout>
    </>
  );
};

export default Home;

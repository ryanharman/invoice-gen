import type { NextPage } from "next";
import { Invoices, Layout } from '~/modules';

const Home: NextPage = () => {
  return (
    <Layout title="Invoices">
      <Invoices />
    </Layout>
  );
};

export default Home;

import { Invoices, Layout } from "~/modules";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Layout title="Invoices">
      <Invoices />
    </Layout>
  );
};

export default Home;

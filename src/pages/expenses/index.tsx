import type { NextPage } from "next";
import { Layout } from '~/modules';
import { Expenses } from '~/modules/expenses';

const Create: NextPage = () => {
  return (
    <Layout title="Expenses">
      <Expenses />
    </Layout>
  );
};

export default Create;

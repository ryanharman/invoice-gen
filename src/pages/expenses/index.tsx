import type { NextPage } from "next";
import { NewLayout } from "~/modules";
import { Expenses } from "~/modules/expenses";

const Create: NextPage = () => {
  return (
    <NewLayout>
      <Expenses />
    </NewLayout>
  );
};

export default Create;

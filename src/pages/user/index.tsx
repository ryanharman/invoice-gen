import type { NextPage } from "next";
import { NewLayout } from '~/modules';
import { User } from '~/modules/user';

const BillingPage: NextPage = () => {
  return (
    <NewLayout
      classNames={{
        main: "p-0",
      }}
    >
      <User />
    </NewLayout>
  );
};

export default BillingPage;

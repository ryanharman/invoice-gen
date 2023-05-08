import { Invoices, NewLayout } from "~/modules";

import type { NextPage } from "next";

const InvoicesPage: NextPage = () => {
  return (
    <NewLayout>
      <Invoices />
    </NewLayout>
  );
};

export default InvoicesPage;

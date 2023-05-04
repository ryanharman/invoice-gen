import type { NextPage } from "next";
import { NewLayout } from "~/modules";
import { Dashboard } from "~/modules/dashboard";

const DashboardPage: NextPage = () => {
  return (
    <NewLayout>
      <Dashboard />
    </NewLayout>
  );
};

export default DashboardPage;

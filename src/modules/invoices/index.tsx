/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { api } from "~/lib/api";
import { Table } from "../table";
import { Button, Skeleton, Typography } from "../ui";
import { useColumns } from "./useColumns";

export function Invoices() {
  const { push } = useRouter();
  const { data } = api.invoices.getAll.useQuery();
  const columns = useColumns();

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  async function createInvoice() {
    await push("/create");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography.H1 className="mb-8">Invoices</Typography.H1>
        <Button onClick={createInvoice}>Create invoice</Button>
      </div>
      <Table data={data} columns={columns} />
    </div>
  );
}

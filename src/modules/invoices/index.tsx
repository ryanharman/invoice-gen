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

  async function createInvoice() {
    await push("invoices/create");
  }

  if (!data) {
    return (
      <>
        <div className="flex items-center justify-between">
          <Typography.H1 className="mb-8">Invoices</Typography.H1>
          <Button onClick={createInvoice}>Create an invoice</Button>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography.H1 className="mb-8">Invoices</Typography.H1>
        <Button onClick={createInvoice}>Create an invoice</Button>
      </div>
      <Table data={data} columns={columns} />
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-8">
          <Typography.H3>No invoices found</Typography.H3>
          <Button variant="secondary" onClick={createInvoice}>
            Create an invoice
          </Button>
        </div>
      )}
    </>
  );
}

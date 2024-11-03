/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { DataTable } from "~/components/data-table/";
import { Typography } from "~/components/typography";
import { api } from "~/lib/api";
import { useColumns } from "./useColumns";

export function Invoices() {
  const { push } = useRouter();
  const { data, isLoading } = api.invoices.getAll.useQuery();
  const columns = useColumns();

  async function createInvoice() {
    await push("invoices/create");
  }

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between">
          <Typography.H1 className="mb-8">Invoices</Typography.H1>
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
      <Typography.H1 className="mb-8">Invoices</Typography.H1>
      {!data || data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <Typography.H3>No invoices found</Typography.H3>
          <Button variant="secondary" onClick={createInvoice}>
            Create an invoice
          </Button>
        </div>
      ) : (
        // @ts-expect-error - this needs resolving eventually
        <DataTable data={data} columns={columns} />
      )}
    </>
  );
}

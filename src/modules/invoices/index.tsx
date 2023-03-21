/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { useMemo } from "react";
import { api } from "~/utils/api";
import { Invoice } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../table";
import { Button, Typography } from "../ui";

function useColumns() {
  const { push } = useRouter();

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        header: "Invoice Number",
        accessorKey: "invoiceNumber",
      },
      {
        header: "Company Name",
        accessorKey: "companyName",
      },
      {
        header: "Invoice Date",
        accessorKey: "invoiceDate",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          // TODO: Once determined statuses, extract this into its own component and handle
          // colours per status.
          <div className="rounded-lg bg-green-300 py-1 text-center text-xs font-medium uppercase text-green-800">
            {row.original.status}
          </div>
        ),
      },
      {
        header: "Customer Name",
        accessorKey: "customerName",
      },
      {
        header: "Customer Email",
        accessorKey: "customerEmail",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="subtle"
              onClick={() => push(`/preview/${row.original.id}`)}
            >
              🔎 Preview
            </Button>
          </div>
        ),
      },
    ],
    [push]
  );
  return columns;
}

export function Invoices() {
  const { data } = api.invoices.getAll.useQuery();
  const columns = useColumns();

  if (!data) return null;

  return (
    <div>
      {/* <div className="flex gap-6">
        <Typography.Large>All Invoices</Typography.Large>
        <Typography.Large>Open Invoices</Typography.Large>
        <Typography.Large>Past Invoices</Typography.Large>
      </div> */}
      <Table data={data} columns={columns} />
      <Typography.Small>- Invoices ({data.length} total)</Typography.Small>
    </div>
  );
}

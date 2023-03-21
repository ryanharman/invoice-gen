/* eslint-disable @typescript-eslint/no-misused-promises */
import { format } from 'date-fns';
import { CheckIcon, CrosshairIcon, LifeBuoyIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Invoice } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui';

export function useColumns() {
  const { push } = useRouter();

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        header: "Invoice Number",
        accessorKey: "invoiceNumber",
        cell: ({ row }) => (
          <div className="font-medium text-slate-400">
            #{row.original.invoiceNumber}
          </div>
        ),
      },
      {
        header: "Company Name",
        accessorKey: "companyName",
      },
      {
        header: "Invoice Date",
        accessorKey: "invoiceDate",
        cell: ({ row }) => (
          <>{format(new Date(row.original.invoiceDate), "dd MMM yyyy")}</>
        ),
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => push(`/preview/${row.original.id}`)}
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                <span>Preview</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LifeBuoyIcon className="mr-2 h-4 w-4" />
                  <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <CrosshairIcon className="mr-2 h-4 w-4" />
                      <span>Unpaid</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      <span>Paid</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
            {/* <Button
              variant="subtle"
              onClick={() => push(`/preview/${row.original.id}`)}
            >
              🔎 Preview
            </Button> */}
          </DropdownMenu>
        ),
      },
    ],
    [push]
  );
  return columns;
}

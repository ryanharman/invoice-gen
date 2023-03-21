/* eslint-disable @typescript-eslint/no-misused-promises */
import { format, isValid } from 'date-fns';
import {
  CheckIcon,
  CrosshairIcon,
  LifeBuoyIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { cn } from '~/lib';
import { api } from '~/utils/api';
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
import { StatusPill } from './StatusPill';

export function useColumns() {
  const { push } = useRouter();
  const context = api.useContext();
  const { mutateAsync } = api.invoices.create.useMutation();

  const duplicateInvoice = useCallback(
    async (invoice: Invoice) => {
      await mutateAsync(
        {
          ...invoice,
          customerAddress: "",
          // This is pretty horrid. Might need to rethink having this as a string.
          invoiceNumber: String(Number(invoice.invoiceNumber) + 1),
          status: "Draft",
        },
        {
          onSuccess: async () => {
            await context.invoices.invalidate();
          },
        }
      );
    },
    [context.invoices, mutateAsync]
  );

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
        cell: ({ row }) => {
          if (!isValid(new Date(row.original.invoiceDate))) return null;
          return (
            <>{format(new Date(row.original.invoiceDate), "dd MMM yyyy")}</>
          );
        },
      },
      {
        header: () => <div className="text-center">Status</div>,
        accessorKey: "status",
        cell: ({ row }) => <StatusPill status={row.original.status} />,
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
              <DropdownMenuItem onClick={() => duplicateInvoice(row.original)}>
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
                    <DropdownMenuItem
                      className={cn(
                        row.original.status.toLowerCase() !== "paid" &&
                          "text-red-800"
                      )}
                    >
                      <CrosshairIcon className="mr-2 h-4 w-4" />
                      <span>Unpaid</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={cn(
                        row.original.status.toLowerCase() === "paid" &&
                          "text-green-800"
                      )}
                    >
                      <CheckIcon className="mr-2 h-4 w-4" />
                      <span>Paid</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="text-red-800"
                // TODO: Implement deletion + confirm modal
                onClick={() => console.log("DELETE")}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [push, duplicateInvoice]
  );
  return columns;
}

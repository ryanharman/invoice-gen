/* eslint-disable @typescript-eslint/no-misused-promises */
import { format, isValid } from "date-fns";
import {
  CheckIcon,
  CrosshairIcon,
  DownloadIcon,
  EditIcon,
  GitPullRequestDraftIcon,
  LifeBuoyIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { cn } from "~/lib";
import { api } from "~/lib/api";
import { Invoice } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useToast,
} from "../ui";
import { StatusPill } from "./StatusPill";

type ChangeStatusParams = {
  status: "Paid" | "Unpaid" | "Draft";
  id: string;
};

export function useColumns() {
  const { push } = useRouter();
  const { toast } = useToast();
  const context = api.useContext();
  const { mutateAsync: create } = api.invoices.create.useMutation();
  const { mutateAsync: update } = api.invoices.update.useMutation();
  const { mutateAsync: deleteInvoice } = api.invoices.delete.useMutation();

  const duplicateInvoice = useCallback(
    async (invoice: Invoice) => {
      await create(
        {
          invoice: {
            ...invoice,
            customerAddress: "",
            // This is pretty horrid. Might need to rethink having this as a string.
            invoiceNumber: invoice.invoiceNumber,
            status: "Draft",
          },
        },
        {
          onSuccess: async () => {
            toast({
              title: "Invoice created",
              description: `Invoice has been duplicated`,
            });
            await context.invoices.invalidate();
          },
        }
      );
    },
    [context.invoices, create, toast]
  );

  const changeStatus = useCallback(
    async ({ status, id }: ChangeStatusParams) => {
      await update(
        {
          invoice: {
            id,
            status,
          },
        },
        {
          onSuccess: async () => {
            toast({
              title: "Status updated",
              description: `Invoice status has been updated to ${status}`,
            });
            await context.invoices.invalidate();
          },
        }
      );
    },
    [context.invoices, update, toast]
  );

  const handleDeletion = useCallback(
    async (id: string) => {
      await deleteInvoice(
        { id },
        {
          onSuccess: async () => {
            toast({
              title: "Invoice delete",
              description: `Invoice has been deleted`,
            });
            await context.invoices.invalidate();
          },
        }
      );
    },
    [context.invoices, deleteInvoice, toast]
  );

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        header: "Invoice Number",
        accessorKey: "invoiceNumber",
        cell: ({ row }) => (
          <div className="font-medium text-muted-foreground">
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
          // Thought: Consider breaking this down into a separate component
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                disabled={row.original.status.toLowerCase() === "paid"}
                onClick={() => push(`/edit/${row.original.id}`)}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateInvoice(row.original)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LifeBuoyIcon className="mr-2 h-4 w-4" />
                  <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      disabled={row.original.status.toLowerCase() === "paid"}
                      onClick={() =>
                        changeStatus({ id: row.original.id, status: "Draft" })
                      }
                      className={cn(
                        row.original.status.toLowerCase() !== "paid" &&
                          "text-gray-500"
                      )}
                    >
                      <GitPullRequestDraftIcon className="mr-2 h-4 w-4" />
                      <span>Draft</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        changeStatus({ id: row.original.id, status: "Unpaid" })
                      }
                      className={cn(
                        row.original.status.toLowerCase() !== "paid" &&
                          "text-orange-500"
                      )}
                    >
                      <CrosshairIcon className="mr-2 h-4 w-4" />
                      <span>Unpaid</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        changeStatus({ id: row.original.id, status: "Paid" })
                      }
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => push(`/preview/${row.original.id}`)}
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                <span>Preview</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                // TODO: Download functionality from here
                onClick={() => push(`/preview/${row.original.id}`)}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={row.original.status.toLowerCase() === "paid"}
                className="text-red-800"
                // TODO: Implement confirm modal
                onClick={() => handleDeletion(row.original.id)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [push, duplicateInvoice, changeStatus, handleDeletion]
  );
  return columns;
}

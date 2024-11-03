import { UploadCloudIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/data-table";
import { Typography } from "~/components/typography";
import { UploadExpensesModal } from "./UploadExpensesModal";
import { useColumns } from "./useColumns";

export function Expenses() {
  // const { data } = api.invoices.getAll.useQuery();
  const columns = useColumns();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [];

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" className="gap-2">
              <Typography.Subtle>Upload more expenses</Typography.Subtle>
              <UploadCloudIcon />
            </Button>
          </DialogTrigger>
          <UploadExpensesModal />
        </Dialog>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}

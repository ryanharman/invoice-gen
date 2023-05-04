import { UploadCloudIcon } from 'lucide-react';
import { api } from '~/lib/api';
import { Table } from '../table';
import { Button, Dialog, DialogTrigger, Skeleton, Typography } from '../ui';
import { UploadExpensesModal } from './UploadExpensesModal';
import { useColumns } from './useColumns';

export function Expenses() {
  // const { data } = api.invoices.getAll.useQuery();
  const columns = useColumns();

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
      <Table data={data} columns={columns} />
    </div>
  );
}

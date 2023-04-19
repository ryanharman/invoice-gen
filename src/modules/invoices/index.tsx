import { api } from "~/lib/api";
import { Table } from "../table";
import { Skeleton } from "../ui";
import { useColumns } from "./useColumns";

export function Invoices() {
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

  return (
    <div>
      <Table data={data} columns={columns} />
    </div>
  );
}

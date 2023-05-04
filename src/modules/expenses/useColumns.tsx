import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

export type Expenses = {
  Date: string;
  Total: string;
  Type: string;
  Filename: string;
};

export function useColumns() {
  const columns: ColumnDef<Expenses>[] = useMemo(
    () => [
      {
        accessorKey: "Date",
      },
      {
        accessorKey: "Total",
      },
      {
        accessorKey: "Type",
        header: "Vendor",
      },
    ],
    []
  );

  return columns;
}

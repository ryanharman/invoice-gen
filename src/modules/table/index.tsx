import { cn } from "~/lib";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

/**
 * Super basic table for now - multiselect, filtering,
 * sorting, pagination, and other features will be added later.
 */
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={cn(
                  "border-b-2 px-4 py-4 text-left text-sm font-semibold uppercase text-primary",
                  "[&:first-child]:rounded-l-lg [&:last-child]:rounded-r-lg",
                  "[&:first-child]:pl-8 [&:last-child]:pr-8"
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-secondary"
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={cn(
                  "px-4 py-3 text-left text-primary",
                  "[&:first-child]:pl-8 [&:last-child]:pr-8"
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

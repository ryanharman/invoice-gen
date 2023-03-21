import { api } from '~/utils/api';
import { Table } from '../table';
import { useColumns } from './useColumns';

export function Invoices() {
  const { data } = api.invoices.getAll.useQuery();
  const columns = useColumns();

  if (!data) return null;

  return (
    <div>
      <Table data={data} columns={columns} />
    </div>
  );
}

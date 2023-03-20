import { api } from '~/utils/api';

export function Invoices() {
  const { data } = api.invoices.getAll.useQuery();
  return (
    <div>
      {data?.map((invoice) => (
        <div key={invoice.id} className="flex gap-4 p-4">
          <div>{invoice.invoiceNumber}</div>
          <div>{invoice.companyName}</div>
          <div>{invoice.invoiceDate}</div>
          <div>{invoice.status}</div>
          <div>{invoice.customerName}</div>
          <div>{invoice.customerEmail}</div>
          <div>{invoice.customerAddress}</div>
        </div>
      ))}
    </div>
  );
}

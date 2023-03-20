import { useMemo } from 'react';

export type InvoiceItem = {
  title: string;
  amount: string;
};

export type TableProps = {
  items?: InvoiceItem[];
};

export function Table({ items }: TableProps) {
  const amountDue = useMemo(
    () => items?.reduce((acc, item) => acc + Number(item.amount), 0),
    [items]
  );

  return (
    <section>
      <table className="mb-4 w-full border-b-2 border-gray-200">
        <thead className="border-b-2 border-gray-200">
          <tr className="text-lg font-bold uppercase text-gray-700">
            <th className="py-4 px-2 text-left">Invoice Items</th>
            <th className="py-4 px-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="px-2 font-light text-gray-700">
          {items?.map((item, idx) => (
            <tr key={idx} className="border-b-2 border-gray-200">
              <td className="py-4 px-2">{item.title}</td>
              <td className="py-4 px-2 text-right">£{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-end gap-2 font-bold uppercase">
        <div className="text-xl text-gray-800">Total Amount Due</div>
        <div className="text-xl">£{amountDue}</div>
      </div>
    </section>
  );
}

import { Button, Input, Label } from '../ui';
import { InvoiceItemWithKey } from './';

type Props = {
  items: InvoiceItemWithKey[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceItemWithKey[]>>;
};

export function InvoiceItems({ items, setItems }: Props) {
  function addItem() {
    if (items.length !== 0) {
      const newItemKey = Math.max(...items.map((item) => item.key)) + 1;
      setItems((prev) => [...prev, { key: newItemKey, title: "", amount: 80 }]);
      return;
    }
    setItems([{ key: 1, title: "", amount: 80 }]);
  }

  function editInvoiceItem(
    value: string,
    item: InvoiceItemWithKey,
    key: string
  ) {
    setItems((prev) => {
      // Remove the previous value and replace it with the new
      const newItems = prev.reduce((acc, curr) => {
        if (curr.key === item.key) {
          return [...acc, { ...curr, [key]: value }];
        }
        return [...acc, curr];
      }, [] as InvoiceItemWithKey[]);
      return newItems;
    });
  }

  function removeItem(item: InvoiceItemWithKey) {
    setItems((prev) => prev.filter((i) => i.key !== item.key));
  }

  return (
    <>
      {items.map((item) => (
        <div key={item.key} className="relative grid grid-cols-2 gap-4 pr-16">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="itemTitle">Item Label</Label>
            <Input
              type="text"
              id="itemTitle"
              placeholder="API implementation"
              value={item.title}
              onChange={(e) => editInvoiceItem(e.target.value, item, "title")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="itemAmount">Amount</Label>
            <Input
              type="number"
              id="itemAmount"
              placeholder="80"
              value={item.amount}
              onChange={(e) => editInvoiceItem(e.target.value, item, "amount")}
            />
          </div>
          <Button
            variant="subtle"
            onClick={() => removeItem(item)}
            className="absolute right-0 top-5 w-min border bg-gray-200 hover:bg-red-500 hover:bg-opacity-50"
          >
            🗑️
          </Button>
        </div>
      ))}
      <Button
        // Key and type prevent this from invoking the onsubmit action
        // very weird behaviour
        type="button"
        key="create-new-item"
        variant="outline"
        onClick={addItem}
      >
        Create new item
      </Button>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/lib/api";
import { Invoice } from "~/server/schemas";
import { InvoiceItemWithKey } from "~/types";
import { Button, Input, Label, Separator, Typography } from "../ui";
import { useToast } from "../ui/toast/useToast";

/**
 * When the user is creating a new invoice, this component is used to
 * create the invoice. The user can edit the invoice details, add items
 * to the invoice, and then create the invoice. The ID from the URL
 * is used to fetch the invoice data from the API if editing.
 */
export function InvoiceForm() {
  const { query } = useRouter();
  const isEdit = !!query.id;
  const { data: editableInvoice, isFetched: isInvoiceFetched } =
    api.invoices.getById.useQuery(
      { id: query.id as string },
      { enabled: isEdit }
    );
  const { data: invoiceDefaults } =
    api.invoiceDefaults.getUserDefaults.useQuery(undefined, {
      enabled: !isEdit,
    });

  const defaultItems = editableInvoice?.items.map((i, idx) => ({
    ...i,
    key: idx + 1,
  })) ?? [{ key: 0, title: "", amount: 80 }];

  const [items, setItems] = useState<InvoiceItemWithKey[]>(defaultItems);

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

  const { handleSubmit, reset, register } = useForm<Invoice>();

  const { mutateAsync } = api.invoices.create.useMutation();
  const { toast } = useToast();

  async function onSubmit(values: Invoice) {
    await mutateAsync(
      {
        invoice: {
          ...invoiceDefaults,
          ...values,
          invoiceNumber: Number(values.invoiceNumber),
          status: "Draft",
        },
        items: items.map((item) => ({
          title: item.title,
          amount: Number(item.amount),
        })),
      },
      {
        onSuccess: () => {
          toast({
            title: "Invoice created",
            description: "Your invoice has been created successfully.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "There was an error creating your invoice.",
          });
        },
      }
    );
  }

  // This is annoying but needed in order for default values to work
  // with RHF
  useEffect(() => {
    if (isInvoiceFetched) {
      reset({ ...editableInvoice, customerAddress: "" });
    }
  }, [reset, editableInvoice, isInvoiceFetched]);

  return (
    <form
      id="invoice-form"
      className="flex w-full max-w-prose flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Invoice details */}
      <Typography.Large>Details</Typography.Large>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="invoiceDate">Invoice issue date</Label>
          <Input {...register("invoiceDate")} id="invoiceDate" type="date" />
        </div>
        <div>
          <Label htmlFor="invoiceNumber">Invoice number</Label>
          <Input
            {...register("invoiceNumber")}
            id="invoiceNumber"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="77"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="customerName">Recipient name</Label>
        <Input
          {...register("customerName")}
          type="text"
          id="customerName"
          placeholder="Jason Bourne Ltd"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerEmail">Recipient email</Label>
        <Input
          {...register("customerEmail")}
          type="email"
          id="customerEmail"
          placeholder="me@email.com"
        />
      </div>

      {/* Invoice items */}
      <Separator />
      <Typography.Large>Items</Typography.Large>
      <div>
        {items.map((item) => (
          <Fragment key={item.key}>
            <div className="flex items-center gap-4">
              <div className="grow">
                <Label htmlFor="invoiceItem">Item</Label>
                <Input
                  type="text"
                  id="invoiceItem"
                  placeholder="Meeting"
                  value={item.title}
                  onChange={(e) =>
                    editInvoiceItem(e.target.value, item, "title")
                  }
                />
              </div>
              <div className="w-28">
                <Label htmlFor="invoiceItemPrice">Price</Label>
                <Input
                  id="invoiceItemPrice"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="80"
                  value={item.amount}
                  onChange={(e) =>
                    editInvoiceItem(e.target.value, item, "amount")
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-6 px-2"
                onClick={() => removeItem(item)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>
          </Fragment>
        ))}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="gap-2 px-0 py-1 text-blue-600"
            onClick={addItem}
          >
            <PlusIcon className="h-4 w-4" /> Add item
          </Button>
          <Typography.Subtle>
            Total: £{items?.reduce((acc, curr) => acc + Number(curr.amount), 0)}
          </Typography.Subtle>
        </div>
      </div>
      <div>
        <Button id="submit-button" form="invoice-form" type="submit">
          Create draft invoice
        </Button>
      </div>
    </form>
  );
}

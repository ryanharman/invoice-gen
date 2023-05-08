/* eslint-disable @typescript-eslint/no-misused-promises */
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { api } from "~/lib/api";
import { Invoice, UpdateInvoice } from "~/server/schemas";
import { InvoiceItemWithKey } from "~/types";
import { CompanyDetails } from "../invoiceDefaults/CompanyDetails";
import { PaymentDetails } from "../invoiceDefaults/PaymentDetails";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DatePicker,
  Input,
  Label,
  Separator,
  Typography,
} from "../ui";
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
      {
        enabled: isEdit,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

  const { data: invoiceDefaults, isFetched: areDefaultsFetched } =
    api.invoiceDefaults.getUserDefaults.useQuery(undefined, {
      enabled: !isEdit,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  const { data: latestInvoiceNumber } =
    api.invoices.getLatestInvoiceNumber.useQuery(undefined, {
      enabled: !isEdit,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  const { mutateAsync: createInvoice } = api.invoices.create.useMutation();
  const { mutateAsync: updateInvoice } = api.invoices.update.useMutation();
  const methods = useForm<Invoice>();
  const { handleSubmit, reset, register, setValue, getValues } = methods;
  const { toast } = useToast();

  const defaultItem = useMemo(() => [{ key: 1, title: "", amount: 80 }], []);
  const invoiceItems = editableInvoice?.items.map((i, idx) => ({
    ...i,
    key: idx + 1,
  }));
  const [items, setItems] = useState<InvoiceItemWithKey[]>(
    invoiceItems?.length ? invoiceItems : defaultItem
  );

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

  async function create(invoice: Invoice) {
    await createInvoice(
      {
        invoice: {
          ...invoiceDefaults,
          ...invoice,
          invoiceNumber: Number(invoice.invoiceNumber),
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

  async function update(invoice: UpdateInvoice) {
    await updateInvoice(
      {
        invoice: {
          ...invoiceDefaults,
          ...invoice,
          invoiceNumber: Number(invoice.invoiceNumber),
        },
        items: items.map((item) => {
          if (item.id) return { ...item, amount: Number(item.amount) };
          return { title: item.title, amount: Number(item.amount) };
        }),
      },
      {
        onSuccess: () => {
          toast({
            title: "Invoice updated",
            description: "Your invoice has been updated successfully.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "There was an error updating your invoice.",
          });
        },
      }
    );
  }

  // TODO: Type guards
  async function onSubmit(values: Invoice | UpdateInvoice) {
    if (isEdit) {
      await update(values as UpdateInvoice);
      return;
    }

    await create(values as Invoice);
  }

  function onDayClick(day?: Date) {
    if (!day) return;
    setValue("invoiceDate", day);
  }

  useEffect(() => {
    if (!isEdit && areDefaultsFetched) {
      reset({ ...invoiceDefaults, invoiceNumber: latestInvoiceNumber });
      return;
    }
    if (isInvoiceFetched) {
      reset({ ...editableInvoice, customerAddress: "" });
    }
  }, [
    reset,
    editableInvoice,
    invoiceDefaults,
    areDefaultsFetched,
    latestInvoiceNumber,
    isEdit,
    isInvoiceFetched,
  ]);

  useEffect(() => {
    if (isInvoiceFetched && invoiceItems?.length) {
      // Somewhat sloppy but works for now.
      // TODO: Revisit this
      if (JSON.stringify(items) === JSON.stringify(defaultItem)) {
        setItems(invoiceItems);
      }
    }
  }, [isInvoiceFetched, invoiceItems, items, defaultItem]);

  const invoiceDate = getValues("invoiceDate");

  return (
    <>
      <Typography.H1 className="mb-2">
        {isEdit ? "Edit invoice" : "Create a new invoice"}
      </Typography.H1>
      <Typography.Subtle className="mb-8 max-w-prose">
        {isEdit
          ? "Add new items, update existing ones, change your company or payment details for this invoice only."
          : "Create a new invoice, add items, change your company or payment details for this invoice only."}
      </Typography.Subtle>
      <form
        id="invoice-form"
        className="grid max-w-screen-2xl grid-cols-1 gap-4 md:grid-cols-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Invoice details */}
              <section className="space-y-4">
                <div className="grid grid-cols-2 items-end gap-6">
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
                  <div className="grid gap-1">
                    <Label htmlFor="invoiceDate">Invoice issue date</Label>
                    <DatePicker
                      id="invoiceDate"
                      defaultValue={
                        invoiceDate ? new Date(invoiceDate) : undefined
                      }
                      selected={invoiceDate ? new Date(invoiceDate) : undefined}
                      onSelect={onDayClick}
                      required
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
                <div className="space-y-1.5">
                  <Label htmlFor="customerEmail">Recipient email</Label>
                  <Input
                    {...register("customerEmail")}
                    type="email"
                    id="customerEmail"
                    placeholder="me@email.com"
                  />
                </div>
              </section>

              {/* Invoice items */}
              <Separator className="my-8" />

              <section className="space-y-4">
                <CardTitle>Items</CardTitle>
                <div>
                  <div className="mb-2 space-y-4">
                    {items?.map((item, idx) => (
                      <Fragment key={item.key}>
                        <div className="flex items-center gap-4">
                          <div className="grow">
                            <Label htmlFor="invoiceItem">Item {idx + 1}</Label>
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
                  </div>
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
                      Total: £
                      {items?.reduce(
                        (acc, curr) => acc + Number(curr.amount),
                        0
                      )}
                    </Typography.Subtle>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
          <div className="space-y-4 md:col-span-2">
            <CompanyDetails />
            <PaymentDetails />
          </div>
          <div>
            <Button id="submit-button" form="invoice-form" type="submit">
              {isEdit ? "Update invoice" : "Create invoice"}
            </Button>
          </div>
        </FormProvider>
      </form>
    </>
  );
}

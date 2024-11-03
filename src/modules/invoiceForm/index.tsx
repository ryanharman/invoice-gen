/* eslint-disable @typescript-eslint/no-misused-promises */
import { Fragment, useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import {
  Loader,
  MailIcon,
  MailWarningIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { z } from "zod";
import { api } from "~/lib/api";
import {
  InvoiceSchema,
  type Invoice,
  type InvoiceWithItems,
  type UpdateInvoice,
} from "~/server/schemas";
import type { InvoiceItemWithKey } from "~/types";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import { Separator } from "~/components/ui/separator";
import { Typography } from "~/components/typography";
import { PaymentDetails } from "../invoiceDefaults/PaymentDetails";
import { CompanyDetails } from "../invoiceDefaults/CompanyDetails";

const defaultItem = [{ key: 1, title: "", amount: 80 }];
const apiResetDefaults = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const validationSchema = InvoiceSchema.omit({ status: true }).extend({
  invoiceNumber: z.union([z.string(), z.number()]),
});

type InvoiceForm = InvoiceWithItems & {
  items: InvoiceItemWithKey[];
};

/**
 * When the user is creating a new invoice, this component is used to
 * create the invoice. The user can edit the invoice details, add items
 * to the invoice, and then create the invoice. The ID from the URL
 * is used to fetch the invoice data from the API if editing.
 */
export function InvoiceForm() {
  const { toast } = useToast();
  const { query, push } = useRouter();
  const isEdit = !!query.id;
  const context = api.useUtils();
  const { data: editableInvoice, isFetched: isInvoiceFetched } =
    api.invoices.getById.useQuery(
      { id: query.id as string },
      { enabled: isEdit, ...apiResetDefaults }
    );

  const [
    { data: invoiceDefaults, isFetched: areDefaultsFetched },
    { data: latestInvoiceNumber },
    { data: hasInvoiceBeenSent },
  ] = api.useQueries((t) => [
    t.invoiceDefaults.getUserDefaults(undefined, {
      enabled: !isEdit,
      ...apiResetDefaults,
    }),
    t.invoices.getLatestInvoiceNumber(undefined, {
      enabled: !isEdit,
      ...apiResetDefaults,
    }),
    t.invoices.hasBeenSent({ id: query.id as string }, { enabled: isEdit }),
  ]);

  const { mutateAsync: createInvoice, isLoading: isInvoiceCreating } =
    api.invoices.create.useMutation();
  const { mutateAsync: updateInvoice, isLoading: isInvoiceUpdating } =
    api.invoices.update.useMutation();
  const { mutateAsync: sendInvoice, isLoading: isInvoiceSending } =
    api.invoices.sendInvoice.useMutation();

  const [isInvoiceSent, setIsInvoiceSent] = useState(false);
  const hasBeenSent = useMemo(() => {
    if (isInvoiceSent) return true;
    return hasInvoiceBeenSent;
  }, [isInvoiceSent, hasInvoiceBeenSent]);

  const methods = useForm<InvoiceForm>({
    resolver: zodResolver(validationSchema),
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
  } = methods;
  const {
    fields,
    append,
    prepend,
    remove,
    update: updateFieldArray,
  } = useFieldArray({
    control,
    name: "items",
    keyName: "formKey",
  });

  function addItem() {
    if (!fields.length) return prepend(defaultItem);
    const newItemKey = Math.max(...fields.map((item) => item.key)) + 1;
    append({
      id: undefined,
      title: "",
      amount: 80,
      key: newItemKey,
    });
  }

  function editInvoiceItem(
    value: string,
    item: InvoiceItemWithKey,
    key: string
  ) {
    const findItemByKey = fields.findIndex((i) => i.key === item.key);
    updateFieldArray(findItemByKey, { ...item, [key]: value });
  }

  function removeItem(item: InvoiceItemWithKey) {
    const findItemByKey = fields.findIndex((i) => i.key === item.key);
    remove(findItemByKey);
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
        items: fields.map((item) => ({
          title: item.title,
          amount: Number(item.amount),
        })),
      },
      {
        onSuccess: async (data) => {
          toast({
            title: "Invoice created",
            description: "Your invoice has been created successfully.",
          });
          await context.invoices.invalidate();
          await push(`/invoices/${data.id}`);
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
          id: query.id as string,
          invoiceNumber: Number(invoice.invoiceNumber),
        },
        items: fields.map((item) => {
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

  async function sendInvoiceOnClick() {
    if (isEdit && editableInvoice?.id) {
      await sendInvoice(
        { id: editableInvoice?.id },
        {
          onSuccess: async () => {
            setIsInvoiceSent(true);
            toast({
              title: "Invoice sent",
              description: "Your invoice has been sent successfully.",
            });
            await context.invoices.invalidate();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "There was an error sending your invoice.",
            });
          },
        }
      );
    }
  }

  async function onDayClick(day?: Date) {
    if (!day) return;
    setValue("invoiceDate", day);
    await trigger("invoiceDate");
  }

  useEffect(() => {
    if (!isEdit && areDefaultsFetched) {
      reset({ ...invoiceDefaults, invoiceNumber: latestInvoiceNumber });
      return;
    }
    if (isInvoiceFetched) {
      reset({
        ...editableInvoice,
        items: editableInvoice?.items.map((i, idx) => ({ ...i, key: idx + 1 })),
        customerAddress: "",
      });
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

  const invoiceDate = getValues("invoiceDate");

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Typography.H1 className="mb-2">
            {isEdit ? "Manage invoice" : "Create a new invoice"}
          </Typography.H1>
          <Typography.Subtle className="max-w-prose">
            {isEdit
              ? "Add new items, update existing ones, change your company or payment details for this invoice only."
              : "Create a new invoice, add items, change your company or payment details for this invoice only."}
          </Typography.Subtle>
          {hasBeenSent && (
            <div className="mt-6 max-w-prose rounded-lg border border-orange-500/50 bg-orange-100/50 p-4">
              <h2 className="flex items-center text-lg font-medium tracking-wide text-orange-500">
                <MailWarningIcon className="mr-2 h-4 w-4" /> Invoice has been
                sent!
              </h2>
              <Typography.Subtle>
                Updating any information on this page will notify the customer
                via a new email and updated payment page.
              </Typography.Subtle>
            </div>
          )}
        </div>
        <div>
          {isEdit && editableInvoice?.status !== "Paid" && !hasBeenSent && (
            <Button
              onClick={sendInvoiceOnClick}
              disabled={isInvoiceSending && hasBeenSent}
              variant="outline"
              className="bg-card"
            >
              {isInvoiceSending ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : (
                <MailIcon className="mr-2 h-4 w-4 " />
              )}
              Send invoice
            </Button>
          )}
        </div>
      </header>
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
                    {errors.invoiceNumber?.message && (
                      <Typography.Small>
                        {errors.invoiceNumber?.message}
                      </Typography.Small>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="invoiceDate">Invoice issue date</Label>
                    <Calendar
                      id="invoiceDate"
                      selected={invoiceDate ? new Date(invoiceDate) : undefined}
                      onSelect={onDayClick}
                      required
                    />
                    {errors.invoiceDate?.message && (
                      <Typography.Small>
                        {errors.invoiceDate.message}
                      </Typography.Small>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerName">Recipient name</Label>
                  <Input
                    {...register("customerName")}
                    id="customerName"
                    type="text"
                    placeholder="Jason Bourne Ltd"
                  />
                  {errors.customerName?.message && (
                    <Typography.Small>
                      {errors.customerName.message}
                    </Typography.Small>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerEmail">Recipient email</Label>
                  <Input
                    {...register("customerEmail")}
                    id="customerEmail"
                    type="email"
                    placeholder="me@email.com"
                  />
                  {errors.customerEmail?.message && (
                    <Typography.Small>
                      {errors.customerEmail?.message}
                    </Typography.Small>
                  )}
                </div>
              </section>

              {/* Invoice items */}
              <Separator className="my-8" />

              <section className="space-y-4">
                <CardTitle>Items</CardTitle>
                <div>
                  <div className="mb-2 space-y-4">
                    {fields?.map((item, idx) => (
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
                      {fields?.reduce(
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
            <Button
              disabled={isEdit ? isInvoiceUpdating : isInvoiceCreating}
              id="submit-button"
              form="invoice-form"
              type="submit"
            >
              {isInvoiceUpdating && <Loader className="mr-2 h-4 w-4" />}
              {isEdit ? "Update invoice" : "Create invoice"}
            </Button>
          </div>
        </FormProvider>
      </form>
    </>
  );
}

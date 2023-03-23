/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { api } from '~/lib/api';
import { InvoiceItemWithKey } from '~/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Separator,
  Typography,
} from '../ui';
import { useToast } from '../ui/toast/useToast';
import { CompanyDetails } from './CompanyDetails';
import { InvoiceFormState } from './context';
import { CustomerDetails } from './CustomerDetails';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoiceItems } from './InvoiceItems';
import { PaymentDetails } from './PaymentDetails';
import { PaymentTerms } from './PaymentTerms';

/**
 * When the user is creating a new invoice, this component is used to
 * create the invoice. The user can edit the invoice details, add items
 * to the invoice, and then create the invoice. The ID from the URL
 * is used to fetch the invoice data from the API if editing.
 */
export function InvoiceForm() {
  const { query } = useRouter();
  const { data } = api.invoices.getById.useQuery(
    { id: query.id as string },
    { enabled: !!query.id }
  );
  const [items, setItems] = useState<InvoiceItemWithKey[]>(
    data?.items.map((i, idx) => ({ ...i, key: idx + 1 })) ?? []
  );
  const methods = useForm<InvoiceFormState>({
    // TODO: Fix customer address at some point
    defaultValues: { ...data, customerAddress: "" },
  });
  const { handleSubmit, reset } = methods;

  const { mutateAsync } = api.invoices.create.useMutation();
  const { toast } = useToast();

  async function onSubmit(values: InvoiceFormState) {
    await mutateAsync(
      {
        invoice: {
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
    if (data) reset();
  }, [data, reset]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex w-full flex-col rounded-md px-8 py-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-8">
            {/* Invoice Information */}
            <div className="flex flex-col gap-4">
              <div>
                <Typography.H2 className="text-2xl font-medium text-gray-800">
                  Invoice Details
                </Typography.H2>
                <Typography.P>
                  All values are required for a properly formatted PDF.
                </Typography.P>
              </div>
              <Accordion
                type="single"
                collapsible
                defaultValue="companyDetails"
              >
                <AccordionItem value="companyDetails">
                  <AccordionTrigger>Company Details</AccordionTrigger>
                  <AccordionContent>
                    <CompanyDetails />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="customerDetails">
                  <AccordionTrigger>Customer Details</AccordionTrigger>
                  <AccordionContent>
                    <CustomerDetails />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="invoiceDetails">
                  <AccordionTrigger>Invoice Details</AccordionTrigger>
                  <AccordionContent>
                    <InvoiceDetails />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="paymentDetails">
                  <AccordionTrigger>Payment Details</AccordionTrigger>
                  <AccordionContent>
                    <PaymentDetails />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="paymentTerms">
                  <AccordionTrigger>Payment Terms</AccordionTrigger>
                  <AccordionContent>
                    <PaymentTerms />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Invoice Items */}
            <div className="flex flex-col gap-4">
              <div>
                <Typography.H2 className="text-2xl font-medium text-gray-800">
                  Invoice Items
                </Typography.H2>
                <Typography.P>Create your invoice items here.</Typography.P>
              </div>
              <Separator />
              <InvoiceItems items={items} setItems={setItems} />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button type="submit">Create Draft Invoice</Button>
            {/* TODO: Preview functionality before draft */}
            <Button variant="link">Preview</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

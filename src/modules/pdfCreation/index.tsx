/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { api } from '~/utils/api';
import { InvoiceItem } from '../pdfPreview/Table';
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
import { PdfCreationState } from './context';
import { CustomerDetails } from './CustomerDetails';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoiceItems } from './InvoiceItems';
import { PaymentDetails } from './PaymentDetails';
import { PaymentTerms } from './PaymentTerms';

export type InvoiceItemWithKey = InvoiceItem & { key: number };

export function PdfCreation() {
  const { mutateAsync } = api.invoices.create.useMutation();
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItemWithKey[]>([]);
  const methods = useForm<PdfCreationState>();
  const { handleSubmit } = methods;

  async function onSubmit(values: PdfCreationState) {
    await mutateAsync(
      {
        invoice: {
          ...values,
          status: "Draft",
        },
        items: items.map((item) => ({
          title: item.title,
          amount: item.amount,
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
            <Button type="submit">Create Invoice</Button>
            <Button variant="subtle">Create Draft</Button>
            <Button variant="link">Preview</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

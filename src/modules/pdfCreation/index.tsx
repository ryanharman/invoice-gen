/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { useReactToPrint } from 'react-to-print';
import { api } from "~/utils/api";
import { PdfPreview } from "../pdfPreview";
import { InvoiceItem } from "../pdfPreview/Table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Separator,
} from "../ui";
import { useToast } from "../ui/toast/useToast";
import { CompanyDetails } from "./CompanyDetails";
import { PdfCreationState } from "./context";
import { CustomerDetails } from "./CustomerDetails";
import { InvoiceDetails } from "./InvoiceDetails";
import { InvoiceItems } from "./InvoiceItems";
import { PaymentDetails } from "./PaymentDetails";
import { PaymentTerms } from "./PaymentTerms";

export type InvoiceItemWithKey = InvoiceItem & { key: number };

export function PdfCreation() {
  const { mutateAsync } = api.invoices.create.useMutation();
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItemWithKey[]>([]);
  const methods = useForm<PdfCreationState>();
  const { handleSubmit, watch } = methods;

  const componentRef = useRef(null);

  // TODO: Move elsewhere
  // const handlePrint = useReactToPrint({
  //   pageStyle: "@page { size: A4 portrait; margin: 0; }",
  //   documentTitle: `Invoice ${watch("invoiceNumber")}`,
  //   content: () => componentRef.current,
  // });

  async function onSubmit(values: PdfCreationState) {
    await mutateAsync(
      {
        ...values,
        status: "created",
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
            duration: 5000,
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
          className="flex w-full flex-col rounded-md border border-gray-300 px-8 py-6 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-8">
            {/* Invoice Information */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-medium text-gray-800">
                  Invoice Details
                </h3>
                <p>All values are required for a properly formatted PDF.</p>
              </div>
              <Separator />
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
                <h3 className="text-2xl font-medium text-gray-800">
                  Invoice Items
                </h3>
                <p>Create your invoice items here.</p>
              </div>
              <Separator />
              <InvoiceItems items={items} setItems={setItems} />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="link">Preview</Button>
            <Button variant="subtle">Create Draft</Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </FormProvider>
      <div
        className="mt-8 flex max-w-4xl justify-center rounded-md p-8"
        ref={componentRef}
      >
        {/* <PdfPreview
          header={{
            title: watch("companyName"),
            number: +watch("invoiceNumber"),
            date: watch("invoiceDate"),
          }}
          contactDetails={{
            customer: {
              name: watch("customerName"),
              email: watch("customerEmail"),
            },
            company: {
              name: watch("companyName"),
              email: watch("companyEmail"),
              address: watch("companyAddress"),
              phone: "",
            },
          }}
          paymentDetails={{
            accountName: watch("accountName"),
            accountNumber: watch("accountNumber"),
            sortCode: watch("sortCode"),
          }}
          paymentTerms={watch("paymentTerms")}
          table={{ items }}
        /> */}
      </div>
    </>
  );
}

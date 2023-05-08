import { useRouter } from "next/router";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { api } from "~/lib/api";
import { Button, InvoicePreview, NewLayout, Typography } from "~/modules";

export default function Preview() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data } = api.invoices.getById.useQuery({ id });
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: A4 portrait; margin: 10; }",
    documentTitle: `Invoice ${data?.invoiceNumber ?? ""}`,
    content: () => componentRef.current,
  });

  if (!data) {
    return null;
  }

  return (
    <NewLayout>
      <div className="flex items-center justify-between">
        <Typography.H1>Invoice {data.invoiceNumber}</Typography.H1>
        <Button variant="outline" onClick={handlePrint}>
          Download as PDF
        </Button>
      </div>
      <div className="mt-4 max-w-4xl rounded-md border bg-white px-6 py-8">
        <InvoicePreview
          ref={componentRef}
          header={{
            title: data.companyName,
            number: Number(data.invoiceNumber),
            date: data.invoiceDate,
          }}
          contactDetails={{
            customer: {
              name: data.customerName,
              email: data.customerEmail,
            },
            company: {
              name: data.companyName,
              email: data.companyEmail,
              address: data.companyAddress,
              phone: "",
            },
          }}
          paymentDetails={{
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            sortCode: data.sortCode,
          }}
          paymentTerms={data.paymentTerms}
          table={{
            items: data.items.map((item) => ({
              title: item.title,
              amount: item.amount,
            })),
          }}
        />
      </div>
    </NewLayout>
  );
}

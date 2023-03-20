import { useRouter } from 'next/router';
import { Layout, PdfPreview } from '~/modules';
import { api } from '~/utils/api';

export default function Preview() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data } = api.invoices.getById.useQuery({ id });

  if (!data) {
    return null;
  }

  return (
    <Layout title="Preview">
      <PdfPreview
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
            amount: String(item.amount),
          })),
        }}
      />
    </Layout>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { format } from "date-fns";
import {
  Building2Icon,
  CalendarClock,
  CreditCard,
  DownloadIcon,
  MailPlus,
} from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { api, cn } from "~/lib";
import { InvoicePreview } from "../invoicePreview";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from "../ui";

/**
 * TODO: Pull payment ID from URL and fetch email
 * in URL link that matches assigned email on invoice.
 */
export function Payment() {
  const { push, query } = useRouter();
  const key = query?.key as string;
  const { data: paymentDue } = api.payments.getByKey.useQuery(
    { key },
    { enabled: !!key, onError: async () => await push("/") }
  );
  const { invoice } = paymentDue ?? {};
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: A4 portrait; margin: 10; }",
    documentTitle: `Invoice ${invoice?.invoiceNumber ?? ""}`,
    content: () => componentRef.current,
  });

  const invoiceAmount = useMemo(
    () => invoice?.items?.reduce((acc, curr) => curr.amount + acc, 0),
    [invoice?.items]
  );

  if (!invoice) return null;

  return (
    <Tabs defaultValue="details" className="h-full grow">
      <div className="bg-card py-8 pb-0">
        <header className="flex items-center justify-between px-8 pb-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`https://avatar.vercel.sh/${
                  invoice?.invoiceNumber ?? 0
                }.png`}
                alt="Avatar"
              />
              <AvatarFallback>{invoice?.customerName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Typography.H1 className="mb-2">
                Invoice #{invoice?.invoiceNumber}
              </Typography.H1>
              <Typography.Subtle className="flex items-center gap-2">
                <Building2Icon className="h-4 w-4" />
                {invoice?.companyName}
              </Typography.Subtle>
              <Typography.Subtle className="flex items-center gap-2">
                <MailPlus className="h-4 w-4" />{" "}
                <a
                  className="hover:underline"
                  href={`mailto:${invoice?.companyEmail}`}
                >
                  {invoice?.companyEmail}
                </a>
              </Typography.Subtle>
              <Typography.Subtle className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" /> Due on{" "}
                {invoice?.invoiceDate &&
                  format(new Date(invoice?.invoiceDate), "MMMM dd, yyyy")}
              </Typography.Subtle>
            </div>
          </div>
          <div
            className={cn(
              "rounded-lg bg-secondary bg-opacity-25 px-5 py-2 text-sm font-medium",
              {
                "bg-green-500": invoice?.status === "Paid",
                "bg-orange-500": invoice?.status === "Unpaid",
              }
            )}
          >
            Invoice status: {invoice?.status}
          </div>
        </header>
        <TabsList className="flex justify-start gap-4 px-8">
          <TabsTrigger value="details">Details and payment</TabsTrigger>
          <TabsTrigger value="preview">Preview invoice</TabsTrigger>
        </TabsList>
      </div>

      <div className="p-8">
        <TabsContent value="details">
          <Card className="max-w-prose">
            <CardHeader>
              <Typography.H3 className="mt-0">Pay invoice</Typography.H3>
              <Typography.Subtle>
                Use one of the vendors chosen payment methods below to pay the
                remaining balance of the invoice.
              </Typography.Subtle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="card">
                <TabsList className="flex justify-start gap-2">
                  <TabsTrigger value="card">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </TabsTrigger>
                  {/* <TabsTrigger value="paypal">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Paypal
                  </TabsTrigger>
                  <TabsTrigger value="stripe">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Stripe
                  </TabsTrigger> */}
                </TabsList>
                <TabsContent value="card" className="space-y-4 pt-4">
                  <Typography.Subtle className="mb-6">
                    Payment by card expected via bank transfer. Please use the
                    details below to make a payment.
                  </Typography.Subtle>
                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground">
                      Account name
                    </Label>
                    {invoice?.accountName ||
                      "No account name found. Please contact the vendor."}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground">
                      Account number
                    </Label>
                    {invoice?.accountNumber ||
                      "No account number found. Please contact the vendor."}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground">Sort code</Label>
                    {invoice?.sortCode ||
                      "No sort code found. Please contact the vendor."}
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="space-y-1 pt-4">
                  Currently not supported
                </TabsContent>
                <TabsContent value="stripe" className="space-y-1 pt-4">
                  Currently not supported
                </TabsContent>
              </Tabs>
              <div>
                <div className="text-muted-foreground">Amount due</div>
                <div className="text-2xl font-bold">
                  £{invoiceAmount?.toFixed(2)}
                </div>
              </div>
              <Separator />
              <Typography.Subtle>
                {invoice?.paymentTerms || "No payment terms found."}
              </Typography.Subtle>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card className="relative max-w-[800px]">
            <Button
              className="absolute -top-4 right-4 bg-muted hover:bg-card"
              variant="outline"
              onClick={handlePrint}
            >
              <DownloadIcon className="mr-2 h-5 w-5" /> Download me
            </Button>
            <CardContent className="bg-white px-8 py-16">
              {invoice && (
                <InvoicePreview
                  ref={componentRef}
                  header={{
                    title: invoice.companyName,
                    number: Number(invoice.invoiceNumber),
                    date: invoice.invoiceDate,
                  }}
                  contactDetails={{
                    customer: {
                      name: invoice.customerName,
                      email: invoice.customerEmail,
                    },
                    company: {
                      name: invoice.companyName,
                      email: invoice.companyEmail,
                      address: invoice.companyAddress,
                      phone: "",
                    },
                  }}
                  paymentDetails={{
                    accountName: invoice.accountName,
                    accountNumber: invoice.accountNumber,
                    sortCode: invoice.sortCode,
                  }}
                  paymentTerms={invoice.paymentTerms}
                  table={{
                    items: invoice.items.map((item) => ({
                      title: item.title,
                      amount: item.amount,
                    })),
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}

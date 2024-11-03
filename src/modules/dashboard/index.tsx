import { AxeIcon, FileIcon, PoundSterlingIcon, UsersIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Typography } from "~/components/typography";
import { DatePicker } from "~/components/date-picker";
import { Overview } from "./OverviewChart";
import { useAnalytics } from "./useAnalytics";

export function Dashboard() {
  const {
    selectedDate,
    setSelectedDate,
    revenue,
    average,
    monthlyInvoices,
    totalUnpaid,
    invoices,
  } = useAnalytics();

  function onDayClick(day: Date) {
    setSelectedDate(day);
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Typography.H1>Dashboard</Typography.H1>
        {/* @ts-expect-error - this needs correcting */}
        <DatePicker onChange={onDayClick} value={selectedDate} />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total revenue
              </CardTitle>
              <PoundSterlingIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{revenue?.revenue}</div>
              <p className="text-xs font-medium text-muted-foreground">
                {Math.round(revenue?.trend ?? 0)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unpaid invoices total
              </CardTitle>
              <AxeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalUnpaid?.total}</div>
              <p className="text-xs font-medium text-muted-foreground">
                From {totalUnpaid?.invoices} invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average invoice total
              </CardTitle>
              <FileIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{Math.round(average?.averageInvoice ?? 0)}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                £{Math.round(average?.trend ?? 0)} variation from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total invoices sent
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyInvoices?.total}</div>
              <p className="text-xs font-medium text-muted-foreground">
                {Math.round(monthlyInvoices?.trend ?? 0)} variation from last
                month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3 max-h-[450px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-10 ">
                {invoices?.map((invoice) => (
                  <div key={invoice.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${invoice.invoiceNumber}.png`}
                        alt="Avatar"
                      />
                      <AvatarFallback>{invoice.customerName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {invoice.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customerEmail}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{invoice.status}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

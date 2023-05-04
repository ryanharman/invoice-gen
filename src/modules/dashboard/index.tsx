import { startOfMonth } from "date-fns";
import { AxeIcon, FileIcon, PoundSterlingIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { api } from "~/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DatePicker,
  Typography,
} from "../ui";
import { Overview } from "./OverviewChart";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfMonth(new Date())
  );
  const { data } = api.invoices.getAll.useQuery({ limit: 15 });
  const { data: revenue } = api.analytics.revenue.useQuery({
    date: selectedDate,
  });
  const { data: average } = api.analytics.averageInvoice.useQuery({
    date: selectedDate,
  });
  const { data: monthlyInvoices } = api.analytics.totalMonthlyInvoices.useQuery(
    { date: selectedDate }
  );
  const { data: totalUnpaid } = api.analytics.totalUnpaidInvoices.useQuery({
    date: selectedDate,
  });

  function onDayClick(day: Date) {
    setSelectedDate(day);
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Typography.H1>Dashboard</Typography.H1>
        <DatePicker onDayClick={onDayClick} />
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
                £{average?.averageInvoice}
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
                {Math.round(monthlyInvoices?.trend ?? 0)} from last month
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
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-10 overflow-y-auto">
                {data?.map((invoice) => (
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

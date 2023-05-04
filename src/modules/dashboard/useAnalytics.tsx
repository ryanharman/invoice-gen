import { startOfMonth } from "date-fns";
import { useState } from "react";
import { api } from "~/lib";

export function useAnalytics() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfMonth(new Date())
  );
  const { data: invoices } = api.invoices.getAll.useQuery({ limit: 15 });
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

  return {
    selectedDate,
    setSelectedDate,
    invoices,
    revenue,
    average,
    monthlyInvoices,
    totalUnpaid,
  };
}

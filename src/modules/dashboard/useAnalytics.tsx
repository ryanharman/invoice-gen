import { useState } from "react";
import { startOfMonth } from "date-fns";
import { api } from "~/lib";

export function useAnalytics() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfMonth(new Date())
  );

  const [
    { data: invoices },
    { data: revenue },
    { data: average },
    { data: monthlyInvoices },
    { data: totalUnpaid },
  ] = api.useQueries((t) => [
    t.invoices.getAll(),
    t.analytics.revenue({ date: selectedDate }),
    t.analytics.averageInvoice({ date: selectedDate }),
    t.analytics.totalMonthlyInvoices({ date: selectedDate }),
    t.analytics.totalUnpaidInvoices({ date: selectedDate }),
  ]);

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

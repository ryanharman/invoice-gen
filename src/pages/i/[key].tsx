import { ErrorBoundary } from "~/modules";
import { Payment } from "~/modules/payment";

export default function PendingPaymentPage() {
  return (
    <ErrorBoundary>
      <Payment />
    </ErrorBoundary>
  );
}

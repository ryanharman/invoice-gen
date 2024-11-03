import { ErrorBoundary } from "~/components/error-boundary";
import { Payment } from "~/modules/payment";

export default function PendingPaymentPage() {
  return (
    <ErrorBoundary>
      <Payment />
    </ErrorBoundary>
  );
}

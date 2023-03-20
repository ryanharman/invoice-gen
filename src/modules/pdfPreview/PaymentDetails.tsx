export type PaymentDetailProps = {
  accountName: string;
  accountNumber: string;
  sortCode: string;
};

export function PaymentDetails({
  accountName,
  accountNumber,
  sortCode,
}: PaymentDetailProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="text-xl font-bold uppercase text-gray-700">
        Payment Details
      </div>
      <div className="font-light text-gray-600">
        <p>
          Account Name:
          <span className="font-semibold text-gray-700"> {accountName}</span>
        </p>
        <p>
          Account Number:
          <span className="font-semibold text-gray-700"> {accountNumber}</span>
        </p>
        <p>
          Sort Code:
          <span className="font-semibold text-gray-700"> {sortCode}</span>
        </p>
      </div>
    </section>
  );
}

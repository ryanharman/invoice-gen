export type PaymentTermsProps = {
  terms: string;
};

export function PaymentTerms({ terms }: PaymentTermsProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="text-xl font-bold uppercase text-gray-700">
        Payment Terms
      </div>
      <div className="font-light text-gray-600">
        <p>{terms}</p>
      </div>
    </section>
  );
}

export type ContactProps = {
  customer: {
    name: string;
    email: string;
  };
  // TODO: Pull this from DB/whatever will be used
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export function Contact({ customer, company }: ContactProps) {
  return (
    <section className="grid grid-cols-2 py-8">
      <div>
        <div className="mb-8 text-xl font-bold uppercase text-gray-700">To</div>
        <h4 className="text-lg font-bold text-gray-800">{customer.name}</h4>
        <p className="font-light text-gray-500">{customer.email}</p>
      </div>
      <div>
        <div className="mb-8 text-xl font-bold uppercase text-gray-700">
          From
        </div>
        <h4 className="text-lg font-bold text-gray-800">{company.name}</h4>
        <div className="mb-4 font-light text-gray-500">
          <p>{company.email}</p>
          <p>{company.phone}</p>
        </div>
        <div className="max-w-xs font-light text-gray-500">
          {company.address}
        </div>
      </div>
    </section>
  );
}

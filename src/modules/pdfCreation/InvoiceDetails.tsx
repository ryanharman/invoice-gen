import { useFormContext } from "react-hook-form";
import { Input, Label } from "../ui";

export function InvoiceDetails({}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="invoiceNumber"
          {...register("invoiceNumber")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invoiceDate">Invoice Date</Label>
        <Input type="date" id="invoiceDate" {...register("invoiceDate")} />
      </div>
    </div>
  );
}

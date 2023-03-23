import { useFormContext } from "react-hook-form";
import { Input, Label } from "../ui";

export function PaymentTerms({}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="paymentTerms">Terms</Label>
        <Input type="text" id="paymentTerms" {...register("paymentTerms")} />
      </div>
    </div>
  );
}

import { useFormContext } from "react-hook-form";
import { Input, Label } from "../ui";

export function PaymentDetails({}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accountName">Account Name</Label>
        <Input type="text" id="accountName" {...register("accountName")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="accountNumber"
          {...register("accountNumber")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sortCode">Sort Code</Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="sortCode"
          {...register("sortCode")}
        />
      </div>
    </div>
  );
}

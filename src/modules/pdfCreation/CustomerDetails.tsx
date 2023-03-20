import { useFormContext } from "react-hook-form";
import { Input, Label, Textarea } from "../ui";

export function CustomerDetails({}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="customerName">Customer Name</Label>
        <Input type="text" id="customerName" {...register("customerName")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerEmail">Customer Email</Label>
        <Input type="email" id="customerEmail" {...register("customerEmail")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerAddress">Customer Address</Label>
        <Textarea id="customerAddress" {...register("customerAddress")} />
      </div>
    </div>
  );
}

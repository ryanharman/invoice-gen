import { useFormContext } from "react-hook-form";
import { Input, Label, Textarea } from "../ui";

export function CompanyDetails({}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input type="text" id="companyName" {...register("companyName")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyEmail">Company Email</Label>
        <Input type="email" id="companyEmail" {...register("companyEmail")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyAddress">Company Address</Label>
        <Textarea id="companyAddress" {...register("companyAddress")} />
      </div>
    </div>
  );
}

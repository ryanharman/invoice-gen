import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "../ui";

export function CompanyDetails() {
  const { register } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your company details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input
            {...register("companyName")}
            type="text"
            id="companyName"
            placeholder="Jason Bourne Ltd"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyEmail">Company email</Label>
          <Input
            {...register("companyEmail")}
            type="email"
            id="companyEmail"
            placeholder="me@email.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyAddress">Company address</Label>
          <Textarea
            {...register("companyAddress")}
            id="companyAddress"
            placeholder="34 Convent Gardens, London, L1 24H"
          />
        </div>
      </CardContent>
    </Card>
  );
}

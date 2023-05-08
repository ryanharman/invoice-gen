import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from "../ui";

export function PaymentDetails() {
  const { register } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your payment details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="accountName">Account name</Label>
          <Input
            {...register("accountName")}
            type="text"
            id="accountName"
            placeholder="Jason Bourne"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="accountNumber">Account number</Label>
            <Input
              {...register("accountNumber")}
              id="accountNumber"
              type="text"
              inputMode="numeric"
              pattern="[-+]?[0-9]*[.,]?[0-9]+"
              placeholder="00112233"
            />
          </div>
          <div>
            <Label htmlFor="sortCode">Sort code</Label>
            <Input
              {...register("sortCode")}
              id="sortCode"
              type="text"
              inputMode="numeric"
              pattern="[-+]?[0-9]*[.,]?[0-9]+"
              placeholder="00 11 33"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="paymentTerms">Payment terms</Label>
          <Input
            {...register("paymentTerms")}
            type="text"
            id="paymentTerms"
            placeholder="Payment within..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/lib";
import { InvoiceDefault } from "~/server/schemas";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
  Typography,
  useToast,
} from "../ui";

export function InvoiceDefaults() {
  const { toast } = useToast();
  const { mutateAsync } = api.invoiceDefaults.upsert.useMutation();
  const { data } = api.invoiceDefaults.getUserDefaults.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { handleSubmit, reset, register } = useForm<InvoiceDefault>();

  async function onSubmit(values: InvoiceDefault) {
    await mutateAsync(
      {
        ...values,
      },
      {
        onSuccess: () =>
          toast({
            title: "Defaults saved",
            description: "Your defaults have been saved",
          }),
      }
    );
  }

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  return (
    <>
      <Typography.H1 className="mb-8">Company defaults</Typography.H1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
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
        <div>
          <Button>Save defaults</Button>
        </div>
      </form>
    </>
  );
}

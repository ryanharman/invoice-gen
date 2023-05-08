/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { api } from "~/lib";
import { InvoiceDefault } from "~/server/schemas";
import { Button, Typography, useToast } from "../ui";
import { CompanyDetails } from "./CompanyDetails";
import { PaymentDetails } from "./PaymentDetails";

export function InvoiceDefaults() {
  const { toast } = useToast();
  const { mutateAsync } = api.invoiceDefaults.upsert.useMutation();
  const { data } = api.invoiceDefaults.getUserDefaults.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const methods = useForm<InvoiceDefault>();
  const { handleSubmit, reset } = methods;

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
      <Typography.H1 className="mb-2">Company defaults</Typography.H1>
      <Typography.Subtle className="mb-8 max-w-prose">
        These values will be used as default values for new invoices. They can
        be changed per invoice on creation or update.
      </Typography.Subtle>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-prose space-y-4">
        <FormProvider {...methods}>
          <CompanyDetails />
          <PaymentDetails />
          <div>
            <Button>Save defaults</Button>
          </div>
        </FormProvider>
      </form>
    </>
  );
}

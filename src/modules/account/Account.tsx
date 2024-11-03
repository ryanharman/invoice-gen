import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { logger } from "~/lib/logger";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Typography } from "~/components/typography";
import { useToast } from "~/hooks/use-toast";

const validationSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type FormValues = z.infer<typeof validationSchema>;

export function Account() {
  const { toast } = useToast();
  const { me } = api.useUtils();
  const { data } = api.me.info.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  const { mutateAsync, isLoading } = api.user.update.useMutation();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!data) return;

    const isValid = validationSchema.safeParse(values);
    if (isValid.success) {
      await mutateAsync(
        { id: data?.id, ...values },
        {
          onSuccess: () => {
            toast({
              title: "Account updated",
              description: "Your account has been updated.",
            });
            me.invalidate().catch((e) => logger.error(e));
          },
          onError: (error) => {
            logger.error("Failed to update account: ", error);
            toast({
              title: "Error",
              description: "An error occurred. Please try again.",
            });
          },
        }
      );
    }
  }

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name ?? "",
        email: data?.email ?? "",
      });
    }
  }, [data, reset]);

  return (
    <div className="space-y-8">
      <div>
        <Typography.H1 className="mb-2">Account</Typography.H1>
        <Typography.Subtle>Manage your account here.</Typography.Subtle>
      </div>
      <form
        id="account-form"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Your details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Enter your name"
              />
              {errors.name?.message && <span>{errors.name.message}</span>}
            </div>
            <div>
              {/* TODO: Error for non unique email input */}
              <Label htmlFor="email">Your email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your email address"
              />
              {errors.email?.message && <span>{errors.email.message}</span>}
            </div>
            <Button disabled={isLoading} type="submit" variant="default">
              Save
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

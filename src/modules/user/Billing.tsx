import { format, fromUnixTime } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { api } from "~/lib";
import { CardStackIcon } from "@radix-ui/react-icons";
import { Button, Card, CardContent, CardHeader, Typography } from "../ui";

export function Billing() {
  const { data: user } = api.me.info.useQuery();
  const { data } = api.stripe.getSubscriptionInfo.useQuery(
    { subscriptionId: user?.stripeSubscriptionId ?? "" },
    { enabled: !!user?.stripeSubscriptionId }
  );
  const { mutate } = api.stripe.createCheckoutSession.useMutation();

  function subscribe() {
    mutate(undefined, {
      onSuccess: (res) => {
        console.log({ res });
        if (!res) return;
        window.open(res);
      },
    });
  }

  console.log({ data });

  return (
    <div className="space-y-8">
      <div>
        <Typography.H1 className="mb-2">Billing</Typography.H1>
        <Typography.Subtle>
          Manage your billing and subscription here.
        </Typography.Subtle>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Billing information</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm font-medium">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Next billing date:{" "}
              {format(
                fromUnixTime(data?.current_period_end ?? 0),
                "dd/MM/yyyy"
              )}
            </span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <CardStackIcon className="mr-2 h-4 w-4" />
            <span>Monthly cost: £{Number(data?.plan?.amount) / 100}</span>
          </div>
        </CardContent>
      </Card>
      <Button onClick={subscribe}>Press me to subscribe</Button>
      <pre>{/* <code>{JSON.stringify(data, null, 2)}</code> */}</pre>
    </div>
  );
}

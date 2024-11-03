import { CreditCardIcon, Settings2Icon, UserCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib";
import { Button } from "~/components/ui/button";
import { Account } from "./Account";
import { Billing } from "./Billing";
import { Settings } from "./Settings";

const tabs = [
  {
    id: "account",
    name: "Account",
    icon: <UserCog className="mr-2 h-4 w-4" />,
  },
  {
    id: "billing",
    name: "Billing",
    icon: <CreditCardIcon className="mr-2 h-4 w-4" />,
  },
  {
    id: "settings",
    name: "Settings",
    icon: <Settings2Icon className="mr-2 h-4 w-4" />,
  },
];

export function User() {
  const { query } = useRouter();
  const currTab = (query.tab as string) ?? "account";

  return (
    <div className="flex">
      <aside className="sticky h-screen w-44 border-r bg-card px-3 pt-8">
        <nav>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <Link href={`/account?tab=${tab.id}`} shallow>
                  <Button
                    className={cn(
                      "w-full justify-start text-sm",
                      tab.id === currTab ? "bg-muted" : ""
                    )}
                    variant="ghost"
                  >
                    {tab.icon}
                    {tab.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="w-full p-8">
        {currTab === "account" ? <Account /> : null}
        {currTab === "billing" ? <Billing /> : null}
        {currTab === "settings" ? <Settings /> : null}
      </div>
    </div>
  );
}

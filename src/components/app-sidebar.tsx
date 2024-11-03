import * as React from "react";
import {
  Boxes,
  Database,
  Github,
  Home,
  LucideListFilter,
  PersonStanding,
  Send,
  Settings2,
} from "lucide-react";
import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { api } from "~/lib";
import { LogoWithText } from "./logo-text";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Boxes,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: PersonStanding,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: LucideListFilter,
    },
    {
      title: "Defaults",
      url: "/defaults",
      icon: Database,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "GitHub",
      url: "https://github.com/ryanharman/invoice-gen",
      icon: Github,
    },
    {
      title: "Contact",
      url: "mailto:me@ryanharman.dev",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = api.me.info.useQuery();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center">
            <LogoWithText height={30} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: me?.name || "You!",
            email: me?.email || "No email found...",
            avatar:
              me?.image ||
              "https://avatars.githubusercontent.com/u/60135756?v=4",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

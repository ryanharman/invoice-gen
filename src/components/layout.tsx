import { cn } from "~/lib";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

type Props = {
  children: React.ReactNode;
  classNames?: {
    header?: string;
    nav?: string;
    main?: string;
  };
};

export function Layout({ children, classNames }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main
          className={cn("flex flex-1 flex-col gap-4 p-4 ", classNames?.main)}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

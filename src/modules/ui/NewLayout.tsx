import Link from "next/link";
import { cn } from "~/lib";
import { ThemeToggle } from "./ThemeToggle";
import { Typography } from "./Typography";

type Props = {
  children: React.ReactNode;
  classNames?: {
    header?: string;
    nav?: string;
    main?: string;
  };
};

export function NewLayout({ children, classNames }: Props) {
  return (
    <>
      <header
        className={cn(
          "flex h-12 w-full items-center justify-between border-b px-8",
          classNames?.main
        )}
      >
        <nav
          className={cn(
            "flex h-full w-full items-center space-x-4 lg:space-x-6",
            classNames?.nav
          )}
        >
          <Typography.Large>Rynvoice</Typography.Large>
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/invoices"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Invoices
          </Link>
          <Link
            href="/defaults"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Defaults
          </Link>
          {/* <Link
            href="/expenses"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Expenses
          </Link> */}
        </nav>

        <ThemeToggle />
      </header>
      <main className={cn("p-8", classNames?.main)}>{children}</main>
    </>
  );
}

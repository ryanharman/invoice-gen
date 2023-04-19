/* eslint-disable @typescript-eslint/no-misused-promises */
import { PlusIcon, SheetIcon, TagIcon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { cn } from "~/lib";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { Typography } from "./Typography";

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  mainClassName?: string;
  headerClassName?: string;
};

export function Layout({
  children,
  title,
  description,
  mainClassName,
  headerClassName,
}: Props) {
  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="max-w-screen">
        <nav className="fixed min-h-screen w-44 border-r px-4 py-2">
          <Typography.Large className="text-center">rynvoice</Typography.Large>
          <ul className="mt-4 flex flex-col gap-4">
            <li>
              <Button
                variant="ghost"
                onClick={() => push("/")}
                className="w-full"
              >
                <SheetIcon className="mr-2 h-4 w-4" />
                Invoices
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                onClick={() => push("/create")}
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create new
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                onClick={() => push("/defaults")}
                className="w-full"
              >
                <TagIcon className="mr-2 h-4 w-4" />
                Defaults
              </Button>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
        <div className="h-full w-full pl-44">
          <header className={cn("border-b px-8 py-6", headerClassName)}>
            <Typography.H1>{title}</Typography.H1>
            {description && <Typography.P>{description}</Typography.P>}
          </header>
          <main className={cn("h-full w-full px-8 py-4", mainClassName)}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

import { AppType } from "next/app";
import Head from "next/head";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";

import { Auth } from "~/modules/auth";
import { cn } from "~/lib";
import { api } from "~/lib/api";
import { Toaster } from "~/components/ui/toaster";
import { ErrorBoundary } from "~/components/error-boundary";
import { ThemeProvider } from "~/components/theme-provider";
import { usePersistedQueryClient } from "~/hooks/use-persisted-queryclient";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  usePersistedQueryClient();
  return (
    <ErrorBoundary>
      <Head>
        <title>Breezy | Invoicing software for anyone</title>
        <meta
          name="description"
          content="Organise your invoices, customers and financials stress free"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider defaultTheme="system" enableSystem attribute="class">
          <Auth required>
            <main className={cn("min-h-screen bg-background antialiased")}>
              <Component {...pageProps} />
              <Toaster />
            </main>
          </Auth>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);

import "~/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/app";
import Head from "next/head";
import { cn } from "~/lib";
import { api } from "~/lib/api";
import { ErrorBoundary, ThemeProvider } from "~/modules";
import { Auth } from "~/modules/auth";
import { Toaster } from "~/modules/ui/toast/Toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Ryan Harman&apos;s Freelance App</title>
        <meta name="description" content="Ree anne herman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Auth required>
          <ThemeProvider defaultTheme="system" enableSystem attribute="class">
            <main className={cn("min-h-screen bg-background antialiased")}>
              <Component {...pageProps} />
              <Toaster />
            </main>
          </ThemeProvider>
        </Auth>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);

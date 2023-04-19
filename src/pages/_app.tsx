import "~/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/app";
import { cn, fontSans } from "~/lib";
import { api } from "~/lib/api";
import { ThemeProvider } from "~/modules";
import { Auth } from "~/modules/auth";
import { Toaster } from "~/modules/ui/toast/Toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth required>
        <ThemeProvider defaultTheme="system" enableSystem attribute="class">
          <main
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            <Component {...pageProps} />
            <Toaster />
          </main>
        </ThemeProvider>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

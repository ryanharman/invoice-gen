import '~/styles/globals.css';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppType } from 'next/app';
import { api } from '~/lib/api';
import { Auth } from '~/modules/auth';
import { Toaster } from '~/modules/ui/toast/Toaster';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth required>
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

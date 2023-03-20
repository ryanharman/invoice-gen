/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from "next";
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { Button } from '~/modules/ui';

const Login: NextPage = () => {
  async function handleLogin() {
    await signIn("discord", { callbackUrl: "http://localhost:3000" });
  }

  return (
    <>
      <Head>
        <title>Invoice</title>
        <meta name="description" content="Ree anne herman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen items-center justify-center bg-slate-200 p-6">
        <div className="flex flex-col justify-center gap-6 rounded-lg border bg-gray-100 px-16 py-8 shadow-sm">
          <h1 className="text-xl font-medium">Login to your account</h1>
          <Button className="bg-blue-700" onClick={handleLogin}>
            Discord
          </Button>
        </div>
      </main>
    </>
  );
};

export default Login;

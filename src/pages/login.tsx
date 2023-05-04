/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Login } from "~/modules/login";
import { Button } from "~/modules/ui";

const LoginPage: NextPage = () => {
  async function handleLogin() {
    await signIn("discord", { callbackUrl: "http://localhost:3000" });
  }

  return (
    <>
      <Head>
        <title>Ryan Harman&apos;s Freelance App</title>
        <meta name="description" content="Ree anne herman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
};

export default LoginPage;

import type { NextPage } from "next";
import Head from "next/head";
import { Login } from "~/modules/login";

const LoginPage: NextPage = () => {
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

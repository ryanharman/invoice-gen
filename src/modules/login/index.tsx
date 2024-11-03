import { Code, Github, LoaderIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/lib";

export function Login() {
  const { push } = useRouter();
  const context = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);

  async function onGitHubLogin() {
    setIsLoading(true);
    const signInResult = await signIn("github", {
      callbackUrl: "/dashboard",
      redirect: true,
    });

    if (signInResult?.error) {
      setIsLoading(false);
      return;
    }
    await context.invalidate();
    await push("/dashboard");
  }

  return (
    <>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Code className="mr-2 h-6 w-6" /> Ryan Harman
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to Rynvoice
              </h1>
              <p className="text-sm text-muted-foreground">
                Use your GitHub or Discord account
              </p>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={onGitHubLogin}
            >
              {isLoading ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}{" "}
              Github
            </Button>
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
}

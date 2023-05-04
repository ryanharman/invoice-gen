import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type AuthProps = {
  children: JSX.Element;
  LoadingComponent?: React.ComponentType;
  required: boolean;
};

export const Auth = ({
  children,
  LoadingComponent,
  required,
}: AuthProps): JSX.Element | null => {
  const { push, pathname } = useRouter();
  const actualRequired = required && pathname !== "/login";
  const { status } = useSession({ required: actualRequired });

  // Break early and show children if auth not required
  if (!actualRequired) return children;

  if (status === "loading") {
    return LoadingComponent ? <LoadingComponent /> : <div />;
  }

  // If the user has a session, show the children
  if (status === "authenticated") {
    return children;
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  push("/login");
  // If the user doesn't have a session, redirect to the login page and render nothing
  return null;
};

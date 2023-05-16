import { useRouter } from "next/router";
import { api } from "~/lib";
import { NO_AUTH_REQUIRED_PAGES } from "./constants";

type AuthProps = {
  children: JSX.Element;
  LoadingComponent?: React.ComponentType;
  required: boolean;
};

type Props = {
  redirectLink?: string;
  required?: boolean;
};

function useOurSession({ redirectLink = "/login", required = true }: Props) {
  const { push } = useRouter();
  const { data: session, status } = api.me.session.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSettled: async (data) => {
      if (data != null || !required) return;
      await push(redirectLink);
    },
  });

  return { session, status };
}

export const Auth = ({
  children,
  LoadingComponent,
  required,
}: AuthProps): JSX.Element | null => {
  const { pathname } = useRouter();
  const actualRequired = required && !NO_AUTH_REQUIRED_PAGES.includes(pathname);
  const { session, status } = useOurSession({
    redirectLink: "/login",
    required: actualRequired,
  });
  // Break early and show children if auth not required, otherwise
  // wait for api response.
  if (!actualRequired) return children;
  if (status === "loading") {
    return LoadingComponent ? <LoadingComponent /> : <div />;
  }
  // If the user has a session, show the children
  if (session != null) {
    return children;
  }
  // If the user doesn't have a session, redirect to the login page and render nothing
  return null;
};

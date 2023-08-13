import { format } from "date-fns";
// For whatever reason github and twitter icons break the dev server?
import { ArrowUpRight, GithubIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { api } from "~/lib";
import { Button } from "../ui";

export function Landing() {
  const { data: me } = api.me.session.useQuery(undefined, {
    // onError: () => {
    //   console.log("User not authenticated 🔐");
    // },
  });

  const directToLogin = useMemo(() => me === undefined || me == null, [me]);

  return (
    <div className="bg-zinc-900 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800/50 p-8">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-bold tracking-wide text-blue-400/75">
            RYNVOICE
          </h4>
        </div>
        <nav className="flex gap-8">
          <a href="https://github.com/ryanharman/invoice-gen" target="_blank">
            {/* <GithubIcon className="h-6 w-6 cursor-pointer transition-all hover:text-purple-400" /> */}
          </a>
          <a href="https://twitter.com/ryanharman_" target="_blank">
            {/* <TwitterIcon className="h-6 w-6 cursor-pointer transition-all hover:text-blue-400" /> */}
          </a>
        </nav>
      </header>
      <main>
        <article id="headline" className="relative min-h-screen">
          <h1 className="flex max-w-prose animate-entry items-center justify-center pt-32 text-6xl font-bold tracking-wide">
            Invoices made simple.
          </h1>
          <p className="mx-auto mt-4 flex max-w-prose animate-entry-slower items-center justify-center text-center font-medium tracking-tight text-zinc-400">
            Rainy days invoicing is an open-source invoice management tool for
            freelancers, small businesses, and anyone else who needs an
            effective solution to track their invoices.
          </p>

          <div className="mt-16 flex animate-entry-slower justify-center gap-8">
            <Link href={directToLogin ? "/login" : "/dashboard"}>
              <Button variant="outline" className="group text-zinc-200">
                <ArrowUpRight className="mr-2 h-4 w-4 transition-all group-hover:text-blue-500" />
                Give it a try
              </Button>
            </Link>
            <Button
              variant="default"
              className="group bg-zinc-50 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-800"
              onClick={() => {
                window.open(
                  "https://github.com/ryanharman/invoice-gen",
                  "_blank"
                );
              }}
            >
              {/* <GithubIcon className="mr-2 h-4 w-4 transition-all group-hover:text-purple-400" /> */}
              Star me on GitHub
            </Button>
          </div>

          <div className="relative flex justify-center py-32 px-16">
            <Image
              className="rounded-lg border-2 border-blue-900/75 shadow-2xl shadow-blue-700/50 transition-shadow"
              src="https://github.com/ryanharman/invoice-gen/raw/main/.github/images/dashboard.jpeg?raw=0"
              alt="Rynvoice dashboard example"
              width={1920 * 0.6}
              height={1080 * 0.6}
            />
          </div>
        </article>
        <section id="features" className="relative min-h-screen">
          <div>
            <h2 className="flex max-w-prose items-center justify-center text-6xl font-bold tracking-wide">
              Features that make sense.
            </h2>
            <p className="mx-auto mt-4 flex max-w-prose items-center justify-center text-center font-medium tracking-tight text-zinc-400">
              Rainy days invoicing was developed to save you time, money, and
              headaches. It provides a simple, intuitive interface to manage
              your invoices and can handle sending them to your clients for you.
            </p>
          </div>
          <article
            id="features"
            className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-32 pt-16"
          >
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-3 h-52 rounded-md border border-zinc-800 bg-zinc-800/50 p-6 shadow-sm shadow-zinc-800/50">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Efficient workflows for invoicing
                </h3>
                <p className="font-medium tracking-tight text-zinc-400">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  eget risus porta, tincidunt turpis at, interdum tortor. Nullam
                  euismod, nisl eget fermentum aliquam, odio nibh ultricies
                </p>
              </div>
              <div className="col-span-2 h-52 rounded-md border border-zinc-800 bg-zinc-800/50 p-6 shadow-sm shadow-zinc-800/50">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Powerful reporting
                </h3>
                <p className="font-medium tracking-tight text-zinc-400">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  eget risus porta, tincidunt turpis at, interdum tortor. Nullam
                  euismod, nisl eget fermentum aliquam, odio nibh ultricies
                </p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-2 h-52 rounded-md border border-zinc-800 bg-zinc-800/50 p-6 shadow-sm shadow-zinc-800/50">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Effective filtering
                </h3>
                <p className="font-medium tracking-tight text-zinc-400">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  eget risus porta, tincidunt turpis at, interdum tortor. Nullam
                  euismod, nisl eget fermentum aliquam, odio nibh ultricies
                </p>
              </div>
              <div className="col-span-3 h-52 rounded-md border border-zinc-800 bg-zinc-800/50 p-6 shadow-sm shadow-zinc-800/50">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Seamless client communication
                </h3>
                <p className="font-medium tracking-tight text-zinc-400">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  eget risus porta, tincidunt turpis at, interdum tortor. Nullam
                  euismod, nisl eget fermentum aliquam, odio nibh ultricies
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
      <footer
        id="footer"
        className="w-full space-y-4 border-t border-zinc-800/50 bg-zinc-800/50 px-10 py-12 shadow-lg"
      >
        <div className="flex items-start justify-between pb-3">
          <div>
            <div className="flex gap-2">
              <h4 className="text-lg font-bold tracking-wide text-blue-400/75">
                RYNVOICE
              </h4>
            </div>
            <p className="mt-3">
              Invoicing made{" "}
              <span className="font-medium text-zinc-100">simple</span>.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="https://github.com/ryanharman/invoice-gen" target="_blank">
              {/* <GithubIcon className="h-6 w-6 cursor-pointer transition-all hover:text-purple-400" /> */}
            </a>
            <a href="https://twitter.com/ryanharman_" target="_blank">
              {/* <TwitterIcon className="h-6 w-6 cursor-pointer transition-all hover:text-blue-400" /> */}
            </a>
          </div>
        </div>
        <div className="w-full border-t border-zinc-400 py-3" />
        <div className="text-xs font-bold tracking-wide">
          © RYAN HARMAN {format(new Date(), "yyyy")}
        </div>
      </footer>
    </div>
  );
}

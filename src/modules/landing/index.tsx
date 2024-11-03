import Link from "next/link";
import { format } from "date-fns";
import { GithubIcon, TwitterIcon } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { LogoIcon } from "~/components/logo";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800/50 p-8">
        <div className="flex items-center gap-1">
          <LogoIcon className="h-4" />
          <h4 className="text-lg font-bold tracking-wide text-[#F8FAFC]">
            breezy
          </h4>
        </div>
        <nav className="flex gap-8">
          <a href="https://github.com/ryanharman/invoice-gen" target="_blank">
            <GithubIcon className="h-6 w-6 cursor-pointer transition-all hover:text-purple-400" />
          </a>
          <a href="https://twitter.com/ryanharman_" target="_blank">
            <TwitterIcon className="h-6 w-6 cursor-pointer transition-all hover:text-blue-400" />
          </a>
        </nav>
      </header>
      <main className="flex h-full grow items-center justify-center">
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Try me
        </Link>
      </main>
      <footer
        id="footer"
        className="w-full space-y-4 border-t border-zinc-800/50 bg-zinc-800/50 px-10 py-8 shadow-lg"
      >
        {/* <div className="flex items-start justify-between pb-3">
          <div>
            <div className="flex gap-2">
              <h4 className="text-lg font-bold tracking-wide text-blue-400/75">
                invoice-gen
              </h4>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="https://github.com/ryanharman/invoice-gen" target="_blank">
              <GithubIcon className="h-6 w-6 cursor-pointer transition-all hover:text-purple-400" />
            </a>
            <a href="https://twitter.com/ryanharman_" target="_blank">
              <TwitterIcon className="h-6 w-6 cursor-pointer transition-all hover:text-blue-400" />
            </a>
          </div>
        </div>
        <div className="w-full border-t border-zinc-400 py-3" /> */}
        <div className="text-xs font-bold tracking-wide">
          © RYAN HARMAN {format(new Date(), "yyyy")}
        </div>
      </footer>
    </div>
  );
}

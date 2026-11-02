import Link from "next/link";

import { SiteCta } from "@/components/ui/site-cta";

/** Unknown routes, and project slugs with no record (dynamicParams is off). */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 px-[var(--site-gutter)]">
      <p className="text-meta uppercase tracking-[0.12em] opacity-60">404</p>
      <h1 className="text-headline">This page does not exist.</h1>
      <p className="text-body opacity-70">
        The link may be out of date, or the project may have moved.{" "}
        <Link href="/#project-gallery" className="underline underline-offset-4">
          See our projects
        </Link>
        .
      </p>
      <SiteCta href="/" className="site-cta--hero  [width:fit-content] [padding:4px_8px_4px_4px] [&:is(:hover,_:focus-visible)]:[width:fit-content] [&:is(:hover,_:focus-visible)]:[padding:4px_8px_4px_4px] [margin-top:12px]">
        Back to home
      </SiteCta>
    </main>
  );
}

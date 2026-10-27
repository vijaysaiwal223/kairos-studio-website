import Image from "next/image";
import Link from "next/link";

type SiteCtaProps = {
  href: string;
  children: string;
  className?: string;
};

export function SiteCta({ href, children, className = "" }: SiteCtaProps) {
  return (
    <Link className={`site-cta ${className}`.trim()} href={href}>
      <span className="site-cta-icon" aria-hidden="true">
        <Image src="/home/hero/cta-arrow.svg" alt="" width={9} height={12} />
      </span>
      <span className="site-cta-label">{children}</span>
    </Link>
  );
}

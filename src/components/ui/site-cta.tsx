import Image from "next/image";
import Link from "next/link";

type SiteCtaProps = {
  href: string;
  children: string;
  className?: string;
};

export function SiteCta({ href, children, className = "" }: SiteCtaProps) {
  return (
    <Link className={`site-cta [&:focus-visible]:[outline:2px_solid_#fff] [&:focus-visible]:[outline-offset:4px] [position:relative] [display:inline-flex] [width:158px] [height:40px] [align-items:center] [gap:6px] [padding:4px_4px_4px_4px] [overflow:hidden] [border-radius:8px] [background:#fff] [color:#000] [font-family:var(--font-geist),_sans-serif] [font-size:16px] [line-height:24px] [letter-spacing:1.5253px] [text-transform:uppercase] [white-space:nowrap] [transition:width_300ms_ease-out,_padding_300ms_ease-out] [&::before]:[position:absolute] [&::before]:[top:4px] [&::before]:[bottom:4px] [&::before]:[left:4px] [&::before]:[width:32px] [&::before]:[border-radius:6px] [&::before]:[background:#131313] [&::before]:[content:''] [&::before]:[transition:width_300ms_ease-out,_inset_300ms_ease-out] [&:is(:hover,_:focus-visible)]:[width:148px] [&:is(:hover,_:focus-visible)]:[padding:2px_8px] [&:is(:hover,_:focus-visible)::before]:[top:2px] [&:is(:hover,_:focus-visible)::before]:[bottom:2px] [&:is(:hover,_:focus-visible)::before]:[left:2px] [&:is(:hover,_:focus-visible)::before]:[width:calc(100%_-_4px)] [&:is(:hover,_:focus-visible)_.site-cta-icon]:[width:16px] [&:is(:hover,_:focus-visible)_.site-cta-label]:[color:#fff] motion-reduce:[transition-duration:0.01ms] motion-reduce:[&::before]:[transition-duration:0.01ms] ${className}`.trim()} href={href}>
      <span className="site-cta-icon  [position:relative] [z-index:1] [display:grid] [width:32px] [height:32px] [flex:none] [place-items:center] [transition:width_300ms_ease-out] [&_img]:[transform:rotate(90deg)] motion-reduce:[transition-duration:0.01ms]" aria-hidden="true">
        <Image src="/home/hero/cta-arrow.svg" alt="" width={9} height={12} />
      </span>
      <span className="site-cta-label  [position:relative] [z-index:1] [transition:color_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]">{children}</span>
    </Link>
  );
}

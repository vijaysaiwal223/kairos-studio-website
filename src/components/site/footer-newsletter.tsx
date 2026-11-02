"use client";

import type { FormEvent } from "react";

/** Opens a prepared subscription request until a mailing-list provider is connected. */
export function FooterNewsletter() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string" || !email.trim()) return;

    const subject = encodeURIComponent("Newsletter subscription");
    const body = encodeURIComponent("Please add " + email.trim() + " to the kai.ros Studio newsletter.");
    window.location.href = "mailto:hello@kairostudios.in?subject=" + subject + "&body=" + body;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-[8px] flex h-[48px] w-full max-w-[318px] items-center gap-[8px] rounded-[8px] bg-[#111] p-[8px]">
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <input id="footer-email" name="email" type="email" autoComplete="email" required placeholder="Enter email..." className="min-w-0 flex-1 bg-transparent text-[16px] leading-[24px] text-white outline-none placeholder:text-[#717171]" />
      <button type="submit" className="inline-flex h-[32px] shrink-0 items-center gap-[3px] rounded-[4px] bg-[#ff4800] px-[12px] text-[12px] leading-[16px] font-medium text-white uppercase transition-colors hover:bg-[#e74100] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Submit <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

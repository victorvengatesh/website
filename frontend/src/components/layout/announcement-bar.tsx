"use client";

import { Sparkles } from "lucide-react";

const messages = [
  "Fresh batch drops every morning",
  "Free delivery on orders above ₹499",
  "Made locally · Packed responsibly",
  "Festival gifting now open",
];

export function AnnouncementBar() {
  const repeated = [...messages, ...messages];

  return (
    <div className="relative overflow-hidden bg-ink py-2 text-canvas" aria-label="Store announcements">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {repeated.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap px-8 text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:px-12"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}

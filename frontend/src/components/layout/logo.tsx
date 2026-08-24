import Link from "next/link";

import { theme } from "@/config/theme";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${theme.brand.name} home`}>
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-[14px] bg-brand-gradient shadow-[0_9px_24px_rgba(233,83,34,.28)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="size-8" aria-hidden="true">
          <path d="M8 20c0-7.2 5.3-13 12-13s12 5.8 12 13-5.3 13-12 13S8 27.2 8 20Z" fill="#fff4de"/>
          <path d="M14 20a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" fill="#e95122"/>
          <circle cx="28.8" cy="10.4" r="4.8" fill="#f5c04d"/>
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-[-0.045em] ${inverse ? "text-white" : "text-ink"}`}>
          Namma<span className="text-brand">Bites</span>
        </span>
        <span className={`mt-1 block text-[0.52rem] font-bold uppercase tracking-[0.19em] ${inverse ? "text-white/[.55]" : "text-muted"}`}>
          Small-batch snacks
        </span>
      </span>
    </Link>
  );
}

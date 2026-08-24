"use client";

import Link from "next/link";
import { ArrowUp, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { theme } from "@/config/theme";

const columns = [
  {
    title: "Shop",
    links: [
      ["All products", "/products"],
      ["Best sellers", "/products?sort=best-sellers"],
      ["Gift boxes", "/products?category=gifting"],
      ["Millet Lab", "/products?category=millet"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Track order", "/track"],
      ["Delivery information", "/#delivery"],
      ["FAQs", "/#faq"],
      ["Contact us", `mailto:${theme.commerce.supportEmail}`],
    ],
  },
  {
    title: "Your Namma",
    links: [
      ["Your account", "/account"],
      ["Orders", "/account/orders"],
      ["Wishlist", "/account/wishlist"],
      ["Saved addresses", "/account/addresses"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-canvas">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex w-full items-center justify-center gap-2 border-b border-white/[.10] py-3 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-canvas/[.65] transition hover:bg-white/5 hover:text-white"
      >
        Back to top <ArrowUp className="size-3.5" />
      </button>
      <div className="page-shell py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo inverse />
            <p className="mt-5 max-w-sm text-sm leading-6 text-canvas/[.62]">{theme.brand.description}</p>
            <div className="mt-6 flex gap-2">
              {[
                { label: "Instagram", icon: Instagram, href: theme.social.instagram },
                { label: "WhatsApp", icon: MessageCircle, href: theme.social.whatsapp },
                { label: "Email", icon: Mail, href: `mailto:${theme.commerce.supportEmail}` },
              ].map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/[.15] text-canvas/[.65] transition hover:border-brand hover:bg-brand hover:text-white">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-white">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-canvas/[.58] transition hover:text-accent">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[.10] pt-6 text-[0.67rem] text-canvas/[.45] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {theme.brand.name}. Crafted locally with care.</p>
          <p className="flex items-center gap-1.5"><MapPin className="size-3.5 text-brand" /> Hyperlocal delivery · Tamil Nadu, India</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

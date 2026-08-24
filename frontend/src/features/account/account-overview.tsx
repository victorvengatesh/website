"use client";

import Link from "next/link";
import { ArrowRight, Heart, MapPin, Package, Sparkles } from "lucide-react";

import { products } from "@/data/products";
import { formatCurrency } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";

export function AccountOverview() {
  const user = useShopStore((state) => state.user);
  const wishlist = useShopStore((state) => state.wishlist);
  const recommended = products.find((product) => product.bestSeller) ?? products[0];

  return (
    <div>
      <p className="eyebrow">Your Namma</p>
      <h1 className="section-title mt-3">Welcome{user ? `, ${user.name.split(" ")[0]}` : " to your shelf"}.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">Orders, saved favourites and delivery details—together, without the clutter.</p>
      {!user && <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand/[.20] bg-brand/6 p-5"><div><p className="text-sm font-extrabold text-ink">Your account is in preview mode.</p><p className="mt-1 text-xs text-muted">Sign in UI is ready for a future authentication provider.</p></div><Link href="/account/sign-in" className="rounded-control bg-brand px-4 py-2.5 text-xs font-bold text-white">Sign in</Link></div>}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [Package, "Orders", "Track every fresh box", "/account/orders", "1 recent"],
          [Heart, "Wishlist", "Your saved cravings", "/account/wishlist", `${wishlist.length} saved`],
          [MapPin, "Addresses", "Faster local checkout", "/account/addresses", "1 address"],
        ].map(([Icon, title, copy, href, meta]) => <Link key={String(title)} href={String(href)} className="group rounded-[1.6rem] border border-line bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand/[.30] hover:shadow-lift"><span className="grid size-11 place-items-center rounded-2xl bg-brand/9 text-brand"><Icon className="size-5" /></span><p className="mt-5 font-display text-lg font-extrabold text-ink">{String(title)}</p><p className="mt-1 text-xs leading-5 text-muted">{String(copy)}</p><div className="mt-5 flex items-center justify-between text-[0.65rem] font-bold text-brand"><span>{String(meta)}</span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></div></Link>)}
      </div>
      <div className="mt-8 overflow-hidden rounded-[2rem] bg-brand-gradient p-6 text-white shadow-glow sm:p-8">
        <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto]"><div><p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-accent"><Sparkles className="size-3.5" /> Picked for you</p><h2 className="mt-3 font-display text-2xl font-extrabold">{recommended.name}</h2><p className="mt-2 max-w-xl text-xs leading-5 text-white/[.65]">{recommended.shortDescription}</p></div><Link href={`/products/${recommended.slug}`} className="rounded-control bg-white px-5 py-3 text-center text-xs font-extrabold text-brand">Explore · {formatCurrency(recommended.price)}</Link></div>
      </div>
    </div>
  );
}

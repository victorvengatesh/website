"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Moon,
  PackageSearch,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Logo } from "@/components/layout/logo";
import { SearchAutocomplete } from "@/components/layout/search-autocomplete";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";
import { cartItemCount, useShopStore } from "@/store/shop-store";

const navItems = [
  { label: "New & noteworthy", href: "/products?sort=newest" },
  { label: "Best sellers", href: "/products?sort=best-sellers" },
  { label: "Deals", href: "/products?deals=true" },
  { label: "Track order", href: "/track" },
];

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useShopStore((state) => state.cart);
  const wishlist = useShopStore((state) => state.wishlist);
  const openCart = useShopStore((state) => state.openCart);
  const theme = useShopStore((state) => state.theme);
  const setTheme = useShopStore((state) => state.setTheme);
  const count = cartItemCount(cart);

  return (
    <header className="sticky top-0 z-40 border-b border-line/[.80] bg-canvas/[.88] backdrop-blur-xl">
      <AnnouncementBar />
      <div className="page-shell">
        <div className="flex h-[4.6rem] items-center gap-3 lg:gap-5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          <Logo />

          <button
            type="button"
            className="hidden shrink-0 items-center gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-ink/5 xl:flex"
            aria-label="Choose delivery location"
          >
            <MapPin className="size-4 text-brand" />
            <span>
              <span className="block text-[0.6rem] font-semibold text-muted">Delivering near</span>
              <span className="block text-xs font-extrabold text-ink">Your neighbourhood</span>
            </span>
          </button>

          <div className="hidden min-w-0 flex-1 md:block">
            <SearchAutocomplete />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              id="site-cart-button"
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-ink/5 hover:text-ink"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="size-[1.15rem]" /> : <Sun className="size-[1.15rem]" />}
            </button>
            <Link
              href="/account"
              className="hidden size-10 place-items-center rounded-xl text-muted transition hover:bg-ink/5 hover:text-ink sm:grid"
              aria-label="Your account"
            >
              <UserRound className="size-[1.15rem]" />
            </Link>
            <Link
              href="/account/wishlist"
              className="relative hidden size-10 place-items-center rounded-xl text-muted transition hover:bg-ink/5 hover:text-ink sm:grid"
              aria-label={`Wishlist with ${wishlist.length} items`}
            >
              <Heart className="size-[1.15rem]" />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.58rem] font-extrabold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center rounded-xl text-ink transition hover:bg-brand/[.10] hover:text-brand"
              aria-label={`Open cart with ${count} items`}
            >
              <ShoppingBag className="size-5" />
              <motion.span
                key={count}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.58rem] font-extrabold text-white"
              >
                {count}
              </motion.span>
            </button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchAutocomplete mobile />
        </div>

        <nav className="hidden h-11 items-center gap-1 border-t border-line/[.70] lg:flex" aria-label="Primary navigation">
          <div
            className="relative h-full"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="flex h-full items-center gap-1.5 border-b-2 border-transparent px-3 text-xs font-extrabold text-ink transition hover:border-brand hover:text-brand"
              onClick={() => setMegaOpen((open) => !open)}
              aria-expanded={megaOpen}
            >
              Shop all
              <ChevronDown className={cn("size-3.5 transition", megaOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full w-[min(900px,calc(100vw-3rem))] overflow-hidden rounded-b-card border border-line bg-surface p-6 shadow-lift"
                >
                  <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                      >
                        <Link
                          href={`/products?category=${category.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="group block rounded-2xl p-2 transition hover:bg-brand/5"
                        >
                          <span className="relative block aspect-square overflow-hidden rounded-xl bg-canvas">
                            <Image src={category.image} alt="" fill sizes="130px" className="object-cover transition duration-500 group-hover:scale-105" />
                          </span>
                          <span className="mt-2 block text-xs font-extrabold text-ink group-hover:text-brand">{category.name}</span>
                          <span className="mt-0.5 block text-[0.62rem] leading-4 text-muted">{category.eyebrow}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-canvas">
                    <span>
                      <span className="block text-xs font-extrabold">Need a delicious place to start?</span>
                      <span className="mt-0.5 block text-[0.65rem] text-canvas/[.65]">Explore our most-loved small-batch edit.</span>
                    </span>
                    <Link href="/products?sort=best-sellers" onClick={() => setMegaOpen(false)} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-deep">
                      Shop the edit
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full items-center border-b-2 border-transparent px-3 text-xs font-bold text-muted transition hover:border-brand hover:text-brand",
                pathname === item.href && "border-brand text-brand",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/products?category=gifting" className="ml-auto flex items-center gap-2 rounded-full bg-accent/[.18] px-3 py-1.5 text-xs font-extrabold text-brand-deep transition hover:bg-accent/[.28] dark:text-accent">
            <PackageSearch className="size-3.5" /> Gift concierge
          </Link>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-ink/[.45] backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[60] w-[min(88vw,23rem)] overflow-y-auto bg-surface p-5 shadow-lift lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line text-muted" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-7">
                <p className="eyebrow">Shop by category</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="overflow-hidden rounded-2xl border border-line bg-canvas"
                    >
                      <span className="relative block aspect-[1.6]">
                        <Image src={category.image} alt="" fill sizes="160px" className="object-cover" />
                      </span>
                      <span className="block p-2.5 text-xs font-extrabold text-ink">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-1 border-t border-line pt-5">
                {[{ label: "All products", href: "/products" }, ...navItems, { label: "My account", href: "/account" }, { label: `Wishlist (${wishlist.length})`, href: "/account/wishlist" }].map((item) => (
                  <Link key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-ink hover:bg-brand/5 hover:text-brand">
                    {item.label}
                    <ChevronDown className="size-4 -rotate-90" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-brand-gradient p-5 text-white">
                <p className="font-display text-xl font-extrabold">Freshness, nearby.</p>
                <p className="mt-1 text-xs leading-5 text-white/[.75]">Local delivery with honest ETAs and careful packing.</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

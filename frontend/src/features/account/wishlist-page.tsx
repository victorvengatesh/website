"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ProductCard } from "@/components/commerce/product-card";
import { buttonStyles } from "@/components/ui/button";
import { products } from "@/data/products";
import { useShopStore } from "@/store/shop-store";

export function WishlistPage() {
  const wishlist = useShopStore((state) => state.wishlist);
  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <div>
      <p className="eyebrow">Saved cravings</p><h1 className="section-title mt-3">Your wishlist.</h1><p className="mt-3 text-sm text-muted">A private little shelf for everything worth coming back to.</p>
      {items.length ? (
        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><AnimatePresence mode="popLayout">{items.map((product) => <ProductCard key={product.id} product={product} />)}</AnimatePresence></motion.div>
      ) : (
        <div className="mt-8 grid min-h-[27rem] place-items-center rounded-[2rem] border border-dashed border-line bg-surface/[.60] text-center"><div><motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.2, repeat: Infinity }} className="mx-auto grid size-20 place-items-center rounded-full bg-brand/[.10] text-brand motion-reduce:animate-none"><Heart className="size-8" /></motion.div><h2 className="mt-5 font-display text-2xl font-extrabold text-ink">No favourites yet.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Tap the heart on anything that catches your eye. It will wait right here.</p><Link href="/products" className={buttonStyles({ className: "mt-5" })}>Find a favourite</Link></div></div>
      )}
    </div>
  );
}

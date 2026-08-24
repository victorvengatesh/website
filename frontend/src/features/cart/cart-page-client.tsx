"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, Minus, PackageOpen, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { buttonStyles } from "@/components/ui/button";
import { theme } from "@/config/theme";
import { formatCurrency } from "@/lib/utils";
import { cartItemCount, cartSubtotal, useShopStore } from "@/store/shop-store";

export function CartPageClient() {
  const cart = useShopStore((state) => state.cart);
  const saved = useShopStore((state) => state.savedForLater);
  const updateQuantity = useShopStore((state) => state.updateQuantity);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const saveForLater = useShopStore((state) => state.saveForLater);
  const moveToCart = useShopStore((state) => state.moveToCart);
  const notify = useShopStore((state) => state.notify);
  const count = cartItemCount(cart);
  const subtotal = cartSubtotal(cart);
  const progress = Math.min(100, (subtotal / theme.commerce.freeShippingThreshold) * 100);
  const delivery = subtotal >= theme.commerce.freeShippingThreshold ? 0 : 39;

  if (!cart.length && !saved.length) {
    return (
      <div className="page-shell grid min-h-[65vh] place-items-center py-20 text-center">
        <div>
          <motion.div animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity }} className="mx-auto grid size-24 place-items-center rounded-full bg-brand/[.10] text-brand motion-reduce:animate-none"><PackageOpen className="size-10" /></motion.div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink">Your snack box is empty.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Let’s fill it with something fresh, crunchy and very difficult to share.</p>
          <Link href="/products" className={buttonStyles({ className: "mt-6" })}>Explore the pantry <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-space pt-10">
      <div>
        <p className="eyebrow">Your selection</p>
        <h1 className="section-title mt-3">Shopping cart.</h1>
        <p className="mt-3 text-sm text-muted">{count} {count === 1 ? "item" : "items"}, packed with care.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] xl:gap-12">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft">
            <AnimatePresence initial={false} mode="popLayout">
              {cart.map((line) => (
                <motion.article layout key={`${line.product.id}-${line.variant}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80, height: 0, padding: 0 }} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line p-4 last:border-0 sm:grid-cols-[8rem_1fr_auto] sm:gap-5 sm:p-5">
                  <Link href={`/products/${line.product.slug}`} className="relative aspect-square overflow-hidden rounded-2xl bg-canvas"><Image src={line.product.image} alt={line.product.name} fill sizes="128px" className="object-cover" /></Link>
                  <div className="min-w-0 py-1">
                    <p className="text-[0.61rem] font-extrabold uppercase tracking-[0.13em] text-brand">{line.product.category}</p>
                    <Link href={`/products/${line.product.slug}`} className="mt-1 block font-display text-base font-extrabold text-ink hover:text-brand sm:text-lg">{line.product.name}</Link>
                    <p className="mt-1 text-[0.67rem] capitalize text-muted">{line.variant} · {line.product.weight} · In stock</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-line bg-canvas p-0.5">
                        <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity - 1, line.variant)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-brand" aria-label={`Decrease ${line.product.name} quantity`}><Minus className="size-3.5" /></button>
                        <span className="w-8 text-center text-xs font-extrabold text-ink">{line.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity + 1, line.variant)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-brand" aria-label={`Increase ${line.product.name} quantity`}><Plus className="size-3.5" /></button>
                      </div>
                      <button type="button" onClick={() => saveForLater(line.product.id, line.variant)} className="flex items-center gap-1.5 text-[0.68rem] font-bold text-muted hover:text-brand"><Bookmark className="size-3.5" /> Save for later</button>
                      <button type="button" onClick={() => { removeFromCart(line.product.id, line.variant); notify({ title: `${line.product.name} removed`, tone: "info" }); }} className="flex items-center gap-1.5 text-[0.68rem] font-bold text-muted hover:text-red-600"><Trash2 className="size-3.5" /> Remove</button>
                    </div>
                  </div>
                  <motion.strong key={line.quantity} initial={{ scale: 0.88 }} animate={{ scale: 1 }} className="col-start-2 text-right font-display text-lg font-extrabold text-ink sm:col-start-auto sm:py-1">{formatCurrency(line.product.price * line.quantity)}</motion.strong>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {saved.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-2xl font-extrabold text-ink">Saved for later</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {saved.map((line) => (
                  <article key={`${line.product.id}-${line.variant}`} className="flex gap-3 rounded-2xl border border-line bg-surface p-3 shadow-soft">
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-xl"><Image src={line.product.image} alt="" fill sizes="80px" className="object-cover" /></span>
                    <div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-extrabold text-ink">{line.product.name}</p><p className="mt-1 text-xs text-muted">{formatCurrency(line.product.price)}</p><button type="button" onClick={() => moveToCart(line.product.id, line.variant)} className="mt-3 text-xs font-extrabold text-brand">Move to cart →</button></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="self-start rounded-[2rem] border border-line bg-surface p-6 shadow-lift lg:sticky lg:top-36">
          <h2 className="font-display text-xl font-extrabold text-ink">Order summary</h2>
          <div className="mt-5 rounded-2xl bg-canvas p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted"><Truck className="size-4 text-brand" />{progress >= 100 ? <strong className="text-success">Free delivery unlocked</strong> : <>Add {formatCurrency(theme.commerce.freeShippingThreshold - subtotal)} for free delivery</>}</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full bg-brand-gradient" /></div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-muted"><dt>Subtotal ({count})</dt><dd className="font-bold text-ink">{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between text-muted"><dt>Estimated delivery</dt><dd className="font-bold text-ink">{delivery ? formatCurrency(delivery) : "Free"}</dd></div>
            <div className="flex justify-between text-muted"><dt>Taxes</dt><dd className="font-bold text-ink">Included</dd></div>
            <div className="flex items-end justify-between border-t border-line pt-4"><dt className="font-extrabold text-ink">Estimated total</dt><motion.dd key={subtotal + delivery} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-2xl font-extrabold text-ink">{formatCurrency(subtotal + delivery)}</motion.dd></div>
          </dl>
          <Link href="/checkout" className={buttonStyles({ className: "mt-6 w-full" })}>Continue to checkout <ArrowRight className="size-4" /></Link>
          <div className="mt-4 flex items-center justify-center gap-2 text-[0.62rem] text-muted"><ShieldCheck className="size-3.5 text-success" /> Secure, payment-ready checkout</div>
        </aside>
      </div>
    </div>
  );
}

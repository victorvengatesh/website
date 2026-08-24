"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { theme } from "@/config/theme";
import { formatCurrency } from "@/lib/utils";
import {
  cartItemCount,
  cartSubtotal,
  useShopStore,
} from "@/store/shop-store";

export function CartDrawer() {
  const open = useShopStore((state) => state.isCartOpen);
  const closeCart = useShopStore((state) => state.closeCart);
  const cart = useShopStore((state) => state.cart);
  const updateQuantity = useShopStore((state) => state.updateQuantity);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const count = cartItemCount(cart);
  const subtotal = cartSubtotal(cart);
  const progress = Math.min(
    100,
    (subtotal / theme.commerce.freeShippingThreshold) * 100,
  );
  const remaining = Math.max(0, theme.commerce.freeShippingThreshold - subtotal);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-ink/[.50] backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[29rem] flex-col bg-surface shadow-lift"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <div>
                <p className="font-display text-xl font-extrabold tracking-tight text-ink">Your cart</p>
                <p className="mt-0.5 text-xs text-muted">{count} {count === 1 ? "item" : "items"} selected</p>
              </div>
              <button type="button" onClick={closeCart} className="grid size-10 place-items-center rounded-xl border border-line text-muted transition hover:border-brand/[.40] hover:text-brand" aria-label="Close cart drawer">
                <X className="size-5" />
              </button>
            </div>

            {cart.length ? (
              <>
                <div className="border-b border-line bg-canvas/[.65] px-5 py-4">
                  <p className="text-xs font-semibold text-muted">
                    {remaining > 0 ? (
                      <>Add <strong className="text-ink">{formatCurrency(remaining)}</strong> more for free delivery</>
                    ) : (
                      <strong className="text-success">You unlocked free delivery.</strong>
                    )}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line/[.80]">
                    <motion.div className="h-full rounded-full bg-brand-gradient" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.55 }} />
                  </div>
                </div>

                <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-2">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cart.map((line, index) => (
                      <motion.article
                        layout
                        key={`${line.product.id}-${line.variant}`}
                        initial={{ opacity: 0, x: 22 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, margin: 0 }}
                        transition={{ delay: index * 0.035 }}
                        className="flex gap-3 border-b border-line py-4"
                      >
                        <Link href={`/products/${line.product.slug}`} onClick={closeCart} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-canvas">
                          <Image src={line.product.image} alt={line.product.name} fill sizes="96px" className="object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link href={`/products/${line.product.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-extrabold leading-5 text-ink hover:text-brand">
                            {line.product.name}
                          </Link>
                          <p className="mt-1 text-[0.65rem] capitalize text-muted">{line.variant} · {line.product.weight}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line bg-canvas p-0.5">
                              <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity - 1, line.variant)} className="grid size-7 place-items-center rounded-full text-muted hover:bg-surface hover:text-brand" aria-label={`Decrease ${line.product.name} quantity`}>
                                <Minus className="size-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-extrabold text-ink">{line.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity + 1, line.variant)} className="grid size-7 place-items-center rounded-full text-muted hover:bg-surface hover:text-brand" aria-label={`Increase ${line.product.name} quantity`}>
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <strong className="text-sm text-ink">{formatCurrency(line.product.price * line.quantity)}</strong>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeFromCart(line.product.id, line.variant)} className="self-start rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/[.30]" aria-label={`Remove ${line.product.name} from cart`}>
                          <Trash2 className="size-4" />
                        </button>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-line bg-surface p-5">
                  <div className="flex items-end justify-between">
                    <span>
                      <span className="block text-xs text-muted">Estimated subtotal</span>
                      <span className="mt-0.5 block text-[0.65rem] text-muted">Taxes included · delivery at checkout</span>
                    </span>
                    <motion.strong key={subtotal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-display text-2xl font-extrabold text-ink">
                      {formatCurrency(subtotal)}
                    </motion.strong>
                  </div>
                  <Link href="/checkout" onClick={closeCart} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-control bg-brand text-sm font-extrabold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-deep">
                    Secure checkout
                    <ShoppingBag className="size-4" />
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="mt-2 flex h-10 w-full items-center justify-center text-xs font-bold text-muted transition hover:text-brand">
                    View and edit full cart
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand/[.10] text-brand">
                    <ShoppingBag className="size-8" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">Your cart is craving crunch.</h2>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">Discover small-batch snacks made fresh and delivered nearby.</p>
                  <Link href="/products" onClick={closeCart} className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 text-sm font-bold text-white">
                    Explore the pantry
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

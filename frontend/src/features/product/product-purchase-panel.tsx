"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, PackageCheck, Plus, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { Rating } from "@/components/ui/rating";
import { cn, discountPercent, formatCurrency } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";
import type { Product } from "@/types/product";

export function ProductPurchasePanel({
  product,
  selectedVariant,
  onVariantChange,
}: {
  product: Product;
  selectedVariant: string;
  onVariantChange: (value: string) => void;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useShopStore((state) => state.addToCart);
  const closeCart = useShopStore((state) => state.closeCart);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <aside className="lg:sticky lg:top-36">
      <div className="rounded-[2rem] border border-line bg-surface p-5 shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-brand">{product.category}</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.045em] text-ink sm:text-4xl">{product.name}</h1>
          </div>
          <WishlistButton productId={product.id} className="relative shrink-0" />
        </div>
        <Rating value={product.rating} count={product.reviewCount} className="mt-4" />
        <p className="mt-4 text-sm leading-6 text-muted">{product.shortDescription}</p>

        <div className="mt-5 flex items-end gap-3 border-y border-line py-5">
          <motion.strong key={product.price} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-3xl font-extrabold tracking-tight text-ink">{formatCurrency(product.price)}</motion.strong>
          {product.compareAtPrice && <span className="mb-1 text-sm text-muted line-through">{formatCurrency(product.compareAtPrice)}</span>}
          {discount > 0 && <span className="mb-1 rounded-full bg-success/[.10] px-2.5 py-1 text-[0.64rem] font-extrabold text-success">Save {discount}%</span>}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between"><p className="text-xs font-extrabold text-ink">Choose a finish</p><span className="text-xs capitalize text-muted">{selectedVariant}</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button key={variant.value} type="button" onClick={() => onVariantChange(variant.value)} className={cn("flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition", selectedVariant === variant.value ? "border-brand bg-brand/7 text-brand" : "border-line text-muted hover:border-brand/[.35] hover:text-ink")} aria-pressed={selectedVariant === variant.value}>
                <span className="grid size-5 place-items-center rounded-full border border-black/[.10]" style={{ background: variant.swatch }}>{selectedVariant === variant.value && <Check className="size-3 text-white drop-shadow" />}</span>
                {variant.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <div>
            <label className="mb-2 block text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-muted">Quantity</label>
            <div className="flex h-12 items-center rounded-control border border-line bg-canvas p-1">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface hover:text-brand" aria-label="Decrease quantity"><Minus className="size-4" /></button>
              <span className="w-8 text-center text-sm font-extrabold text-ink">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface hover:text-brand" aria-label="Increase quantity"><Plus className="size-4" /></button>
            </div>
          </div>
          <AddToCartButton product={product} quantity={quantity} variant={selectedVariant} label="Add to cart" full className="h-12 flex-1" />
        </div>
        <button
          type="button"
          onClick={() => {
            addToCart(product, quantity, selectedVariant);
            closeCart();
            router.push("/checkout");
          }}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-control bg-ink text-sm font-extrabold text-canvas shadow-soft transition hover:-translate-y-0.5 hover:bg-brand"
        >
          Buy now
        </button>

        <div className="mt-5 space-y-3 rounded-2xl bg-canvas p-4">
          {[
            [Truck, "Local delivery", "ETA confirmed by the shop"],
            [PackageCheck, "Freshly packed", `Batch sealed · ${product.weight}`],
            [ShieldCheck, "Secure flow", "Stripe-ready payment structure"],
          ].map(([Icon, title, copy]) => (
            <div key={String(title)} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
              <span><strong className="block text-xs text-ink">{String(title)}</strong><span className="block text-[0.65rem] text-muted">{String(copy)}</span></span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

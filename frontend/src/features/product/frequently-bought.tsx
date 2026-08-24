"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";
import type { Product } from "@/types/product";

export function FrequentlyBought({ items }: { items: Product[] }) {
  const [selected, setSelected] = useState(items.map((item) => item.id));
  const addToCart = useShopStore((state) => state.addToCart);
  const notify = useShopStore((state) => state.notify);
  const chosen = items.filter((item) => selected.includes(item.id));
  const total = chosen.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="mt-12 rounded-[2rem] bg-ink p-5 text-canvas shadow-lift sm:p-8 lg:p-10">
      <p className="eyebrow text-accent">Better together</p>
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Frequently bought together.</h2>
        <div className="text-left sm:text-right"><p className="text-[0.62rem] uppercase tracking-[0.12em] text-canvas/[.55]">Bundle total</p><strong className="font-display text-2xl font-extrabold text-white">{formatCurrency(total)}</strong></div>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((product, index) => {
            const active = selected.includes(product.id);
            return (
              <div key={product.id} className="flex shrink-0 items-center gap-3">
                {index > 0 && <Plus className="size-4 text-accent" />}
                <button type="button" onClick={() => setSelected((current) => active ? current.filter((id) => id !== product.id) : [...current, product.id])} className={`relative w-36 overflow-hidden rounded-2xl border p-2 text-left transition ${active ? "border-accent bg-white/8" : "border-white/[.10] opacity-[.45]"}`} aria-pressed={active}>
                  <span className="relative block aspect-square overflow-hidden rounded-xl"><Image src={product.image} alt="" fill sizes="140px" className="object-cover" /></span>
                  <span className="mt-2 line-clamp-2 block text-xs font-bold leading-4 text-white">{product.name}</span>
                  <span className="mt-1 block text-[0.65rem] text-canvas/[.55]">{formatCurrency(product.price)}</span>
                  <span className={`absolute right-3 top-3 grid size-6 place-items-center rounded-full ${active ? "bg-accent text-ink" : "bg-ink/[.50] text-white"}`}><Check className="size-3.5" /></span>
                </button>
              </div>
            );
          })}
        </div>
        <Button
          disabled={!chosen.length}
          onClick={() => {
            chosen.forEach((product) => addToCart(product));
            notify({ title: `${chosen.length} items added`, description: "Your pairing is ready in the cart." });
          }}
          className="w-full md:w-auto"
        >
          Add selected · {formatCurrency(total)}
        </Button>
      </div>
    </section>
  );
}

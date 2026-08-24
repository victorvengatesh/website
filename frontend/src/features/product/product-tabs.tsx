"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const tabs = ["Description", "Specifications", "Reviews", "Q&A"] as const;
type Tab = (typeof tabs)[number];

function Reviews({ product }: { product: Product }) {
  const distribution = [
    [5, 78],
    [4, 15],
    [3, 5],
    [2, 1],
    [1, 1],
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[17rem_1fr]">
      <div className="rounded-2xl bg-canvas p-6 text-center">
        <strong className="font-display text-6xl font-extrabold tracking-[-0.07em] text-ink">{product.rating.toFixed(1)}</strong>
        <div className="mt-3 flex justify-center gap-0.5 text-accent" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</div>
        <p className="mt-2 text-xs text-muted">Based on {product.reviewCount.toLocaleString("en-IN")} verified reviews</p>
      </div>
      <div className="space-y-3 self-center">
        {distribution.map(([stars, percent], index) => (
          <div key={stars} className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-3 text-xs">
            <span className="font-bold text-ink">{stars} star</span>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.06 }} className="h-full rounded-full bg-accent" />
            </div>
            <span className="text-right text-muted">{percent}%</span>
          </div>
        ))}
      </div>
      <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
        {[
          ["Exactly the crunch I wanted", "The seasoning is balanced and the packed-on date is a lovely touch. It reached us beautifully crisp.", "Meera K."],
          ["Fresh, elegant and giftable", "Bought one for home and another as a gift. Both disappeared before tea was over.", "Karthik S."],
        ].map(([title, copy, name]) => (
          <article key={title} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex gap-0.5 text-accent">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3 fill-current" />)}</div>
            <h4 className="mt-3 text-sm font-extrabold text-ink">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted">{copy}</p>
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-brand">{name} · Verified</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <section className="mt-12 overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft">
      <div className="scrollbar-none flex overflow-x-auto border-b border-line px-3 sm:px-6" role="tablist" aria-label="Product information">
        {tabs.map((tab) => (
          <button key={tab} type="button" role="tab" aria-selected={active === tab} onClick={() => setActive(tab)} className={cn("relative shrink-0 px-4 py-5 text-xs font-extrabold text-muted transition hover:text-brand sm:px-6", active === tab && "text-brand")}>
            {tab}
            {active === tab && <motion.span layoutId="product-tab" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand" />}
          </button>
        ))}
      </div>
      <div className="p-5 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} role="tabpanel">
            {active === "Description" && (
              <div className="grid gap-7 md:grid-cols-[1.2fr_.8fr]">
                <div><p className="eyebrow">The full story</p><h2 className="mt-3 font-display text-2xl font-extrabold text-ink">Crafted for an honest, memorable bite.</h2><p className="mt-4 text-sm leading-7 text-muted">{product.description}</p></div>
                <div className="rounded-2xl bg-canvas p-5"><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-ink">Ingredients</p><div className="mt-4 flex flex-wrap gap-2">{product.ingredients.map((ingredient) => <span key={ingredient} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">{ingredient}</span>)}</div><p className="mt-5 text-[0.65rem] leading-5 text-muted">Allergen note: prepared in a kitchen that handles nuts, gluten, dairy and sesame.</p></div>
              </div>
            )}
            {active === "Specifications" && (
              <dl className="grid overflow-hidden rounded-2xl border border-line sm:grid-cols-2">
                {[
                  ["Net weight", product.weight],
                  ["Batch style", "Small-batch production"],
                  ["Storage", "Cool, dry place · airtight after opening"],
                  ["Shelf life", product.category === "sweets" ? "10–15 days" : "30–45 days"],
                  ["Dietary", product.dietary.join(" · ")],
                  ["SKU", product.sku],
                ].map(([term, value], index) => (
                  <div key={term} className={cn("grid grid-cols-[8rem_1fr] border-line p-4 text-xs", index < 4 && "border-b", index % 2 === 0 && "sm:border-r")}><dt className="font-bold text-muted">{term}</dt><dd className="font-semibold text-ink">{value}</dd></div>
                ))}
              </dl>
            )}
            {active === "Reviews" && <Reviews product={product} />}
            {active === "Q&A" && (
              <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
                <div className="divide-y divide-line border-y border-line">
                  {[
                    ["Is this made after I order?", "It is selected from the newest available small batch. The packed-on date is printed on the pack."],
                    ["Can I ask for a milder spice level?", "Choose the Mild variant when available. For gifting or bulk orders, the team can discuss custom batches."],
                    ["How should I keep it crisp?", "Reseal immediately after serving and store away from heat or moisture. An airtight steel or glass jar works best."],
                  ].map(([question, answer]) => (
                    <details key={question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-ink marker:hidden">{question}<ChevronDown className="size-4 text-brand transition group-open:rotate-180" /></summary><p className="pr-8 pt-2 text-xs leading-5 text-muted">{answer}</p></details>
                  ))}
                </div>
                <div className="rounded-2xl bg-brand/8 p-5"><MessageCircleQuestion className="size-6 text-brand" /><p className="mt-4 text-sm font-extrabold text-ink">Still curious?</p><p className="mt-1 text-xs leading-5 text-muted">Ask the store about allergens, gifting or bulk quantities.</p><button type="button" className="mt-4 text-xs font-extrabold text-brand">Ask a question →</button></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

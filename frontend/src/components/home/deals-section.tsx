"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/types/product";

function Countdown() {
  const [seconds, setSeconds] = useState(8 * 60 * 60 + 42 * 60 + 18);

  useEffect(() => {
    const interval = window.setInterval(
      () => setSeconds((value) => (value > 0 ? value - 1 : 24 * 60 * 60)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    ["Hrs", Math.floor(seconds / 3600)],
    ["Min", Math.floor((seconds % 3600) / 60)],
    ["Sec", seconds % 60],
  ] as const;

  return (
    <div className="flex items-center gap-2" aria-label={`Deals end in ${units.map(([label, value]) => `${value} ${label}`).join(" ")}`}>
      {units.map(([label, value], index) => (
        <div key={label} className="flex items-center gap-2">
          <span className="grid min-w-12 place-items-center rounded-xl border border-white/[.14] bg-white/[.10] px-2 py-2 text-center backdrop-blur">
            <strong className="font-display text-lg text-white">{String(value).padStart(2, "0")}</strong>
            <small className="text-[0.48rem] font-bold uppercase tracking-[0.13em] text-white/[.55]">{label}</small>
          </span>
          {index < units.length - 1 && <span className="font-display text-xl font-bold text-accent">:</span>}
        </div>
      ))}
    </div>
  );
}

export function DealsSection({ products }: { products: Product[] }) {
  return (
    <section className="section-space overflow-hidden bg-ink text-canvas">
      <div className="page-shell">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-accent"><Clock3 className="size-3.5" /> Fresh clock</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">Deals worth pausing for.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-canvas/[.58]">Short runs, fresh batches, honest prices. When the timer resets, the pantry changes.</p>
          </div>
          <Countdown />
        </Reveal>
        <div className="scrollbar-none -mx-4 mt-9 flex snap-x gap-4 overflow-x-auto px-4 pb-8 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {products.slice(0, 6).map((product, index) => (
            <Reveal key={product.id} delay={index * 0.055} className="w-[78vw] max-w-[19rem] shrink-0 snap-start">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

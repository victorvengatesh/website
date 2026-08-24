"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchX, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/commerce/product-card";
import { buttonStyles } from "@/components/ui/button";
import { searchProducts } from "@/data/products";

export function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="page-shell section-space pt-10">
      <div className="max-w-3xl">
        <p className="eyebrow"><Sparkles className="size-3.5" /> Search the pantry</p>
        <h1 className="section-title mt-3">
          {query ? <>Results for “<span className="text-brand">{query}</span>”</> : "What are you craving?"}
        </h1>
        <p className="mt-3 text-sm text-muted">{results.length} {results.length === 1 ? "match" : "matches"} across snacks, sweets and gift boxes.</p>
      </div>
      {results.length ? (
        <motion.div layout className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="grid min-h-[32rem] place-items-center text-center">
          <div>
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 3.4, repeat: Infinity }} className="mx-auto grid size-24 place-items-center rounded-full bg-brand/[.10] text-brand motion-reduce:animate-none"><SearchX className="size-10" /></motion.div>
            <h2 className="mt-6 font-display text-3xl font-extrabold text-ink">No crumbs found.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Try “murukku”, “sweet”, “millet” or “gift box”—or explore the full pantry instead.</p>
            <Link href="/products" className={buttonStyles({ className: "mt-6" })}>Browse all products</Link>
          </div>
        </div>
      )}
    </div>
  );
}

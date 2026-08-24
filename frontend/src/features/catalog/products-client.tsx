"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid2X2, List, SearchX, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ProductCard } from "@/components/commerce/product-card";
import { ProductCardSkeleton } from "@/components/commerce/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import {
  defaultFilters,
  FilterPanel,
  type CatalogFilters,
} from "@/features/catalog/filter-panel";
import { cn } from "@/lib/utils";
import type { CategorySlug, Product } from "@/types/product";

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest" | "best-sellers";

const sortProducts = (items: Product[], sort: SortOption) => {
  const sorted = [...items];
  switch (sort) {
    case "price-low": return sorted.sort((a, b) => a.price - b.price);
    case "price-high": return sorted.sort((a, b) => b.price - a.price);
    case "rating": return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest": return sorted.sort((a, b) => Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival)));
    case "best-sellers": return sorted.sort((a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)) || b.reviewCount - a.reviewCount);
    default: return sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.rating - a.rating);
  }
};

export function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const initialSort = (searchParams.get("sort") as SortOption | null) ?? "featured";
  const initialDeals = searchParams.get("deals") === "true";
  const [filters, setFilters] = useState<CatalogFilters>({
    ...defaultFilters,
    categories: initialCategory ? [initialCategory] : [],
    dealsOnly: initialDeals,
  });
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(12);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (product.price > filters.maxPrice) return false;
      if (product.rating < filters.rating) return false;
      if (filters.inStock && product.stock <= 0) return false;
      if (filters.dealsOnly && !product.deal) return false;
      return true;
    });
    return sortProducts(result, sort);
  }, [filters, sort]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || visible >= filtered.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible((count) => Math.min(count + 8, filtered.length));
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length, visible]);

  const reset = () => {
    setVisible(12);
    setFilters(defaultFilters);
  };
  const changeFilters = (nextFilters: CatalogFilters) => {
    setVisible(12);
    setFilters(nextFilters);
  };
  const activeCount =
    filters.categories.length +
    Number(filters.maxPrice < 2000) +
    Number(filters.rating > 0) +
    Number(filters.inStock) +
    Number(filters.dealsOnly);

  return (
    <div className="page-shell section-space pt-8 sm:pt-12">
      <div className="rounded-[2.2rem] bg-ink px-5 py-9 text-white shadow-lift sm:px-9 sm:py-12 lg:px-12">
        <p className="eyebrow text-accent">The complete pantry</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">Find your kind of crunch.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/[.62] sm:text-base">Thirty small-batch favourites across savouries, sweets, chips, millet, bakery and gifting—easy to filter, delightful to explore.</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="text-sm font-extrabold text-ink">{filtered.length} products</p>
          <p className="mt-0.5 text-[0.66rem] text-muted">Showing {Math.min(visible, filtered.length)} of {filtered.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)} className="lg:hidden">
            <SlidersHorizontal className="size-4" /> Filters {activeCount ? `(${activeCount})` : ""}
          </Button>
          <label className="sr-only" htmlFor="catalog-sort">Sort products</label>
          <select id="catalog-sort" value={sort} onChange={(event) => { setVisible(12); setSort(event.target.value as SortOption); }} className="h-9 rounded-control border border-line bg-surface px-3 text-xs font-bold text-ink outline-none focus:border-brand">
            <option value="featured">Featured</option>
            <option value="best-sellers">Best sellers</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Customer rating</option>
            <option value="newest">Newest</option>
          </select>
          <div className="hidden rounded-control border border-line bg-surface p-1 sm:flex" aria-label="Product layout">
            <button type="button" onClick={() => setLayout("grid")} className={cn("grid size-7 place-items-center rounded-lg text-muted", layout === "grid" && "bg-brand text-white")} aria-label="Grid view" aria-pressed={layout === "grid"}><Grid2X2 className="size-3.5" /></button>
            <button type="button" onClick={() => setLayout("list")} className={cn("grid size-7 place-items-center rounded-lg text-muted", layout === "list" && "bg-brand text-white")} aria-label="List view" aria-pressed={layout === "list"}><List className="size-3.5" /></button>
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[15.5rem_1fr] xl:grid-cols-[17rem_1fr]">
        <aside className="hidden self-start rounded-card border border-line bg-surface p-5 shadow-soft lg:sticky lg:top-36 lg:block" aria-label="Product filters">
          <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} />
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /></div>
          ) : filtered.length ? (
            <motion.div layout className={cn("grid gap-4", layout === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout">
                {filtered.slice(0, visible).map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="grid min-h-[30rem] place-items-center rounded-card border border-dashed border-line bg-surface/[.65] p-8 text-center">
              <div>
                <motion.div animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mx-auto grid size-20 place-items-center rounded-full bg-brand/[.10] text-brand motion-reduce:animate-none"><SearchX className="size-8" /></motion.div>
                <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">That shelf is empty—for now.</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Remove a filter or widen your price range to bring more fresh options back.</p>
                <Button onClick={reset} className="mt-5">Clear all filters</Button>
              </div>
            </motion.div>
          )}
          <div ref={sentinel} className="mt-6 flex h-12 items-center justify-center text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted" aria-live="polite">
            {visible < filtered.length ? "Loading more fresh picks…" : filtered.length ? "You’ve reached the end of the pantry." : ""}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.button type="button" aria-label="Close filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterOpen(false)} className="fixed inset-0 z-[70] bg-ink/[.50] backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 350, damping: 34 }} className="fixed inset-y-0 right-0 z-[80] w-[min(92vw,25rem)] overflow-y-auto bg-surface p-5 shadow-lift lg:hidden" aria-label="Mobile product filters">
              <div className="mb-5 flex justify-end"><button type="button" onClick={() => setFilterOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line text-muted" aria-label="Close filters"><X className="size-5" /></button></div>
              <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} />
              <Button onClick={() => setFilterOpen(false)} className="mt-4 w-full">Show {filtered.length} products</Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

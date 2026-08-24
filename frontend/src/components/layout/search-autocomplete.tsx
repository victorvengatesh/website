"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Search, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { categories, searchProducts } from "@/data/products";
import { cn, formatCurrency } from "@/lib/utils";

const trending = ["Butter murukku", "Banana chips", "Gift box", "Millet snacks"];

function Highlight({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-accent/[.25] text-ink">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchAutocomplete({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const results = useMemo(
    () => searchProducts(debouncedQuery).slice(0, 5),
    [debouncedQuery],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function choose(value: string) {
    setQuery(value);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <div ref={rootRef} className={cn("relative", mobile ? "w-full" : "min-w-0 flex-1") }>
      <form onSubmit={submit} role="search" className="group relative">
        <label htmlFor={mobile ? "mobile-search" : "site-search"} className="sr-only">
          Search products and categories
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted transition group-focus-within:text-brand" aria-hidden="true" />
        <input
          id={mobile ? "mobile-search" : "site-search"}
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Search snacks, sweets and gift boxes"
          className="h-11 w-full rounded-control border border-line bg-canvas/[.65] pl-11 pr-20 text-sm text-ink shadow-inner outline-none transition placeholder:text-muted/[.75] hover:border-brand/[.30] focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/[.10]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-[0.7rem] bg-brand text-white transition hover:bg-brand-deep active:scale-95"
          aria-label="Submit search"
        >
          <ArrowRight className="size-4" />
        </button>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            id="search-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-lift"
          >
            {!debouncedQuery ? (
              <div className="p-2">
                <div className="mb-2 flex items-center gap-2 px-2 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-muted">
                  <TrendingUp className="size-3.5" /> Trending now
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => choose(item)}
                      className="rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink transition hover:border-brand/[.40] hover:bg-brand/5 hover:text-brand"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-4 border-t border-line pt-3">
                  <div className="mb-2 flex items-center gap-2 px-2 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-muted">
                    <Clock3 className="size-3.5" /> Browse categories
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.slug}
                        onClick={() => choose(category.name)}
                        className="rounded-xl px-2 py-2 text-left text-xs font-semibold text-ink transition hover:bg-brand/5 hover:text-brand"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length ? (
              <div className="space-y-1">
                {results.map((product) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    key={product.id}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/products/${product.slug}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-brand/5"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-canvas">
                      <Image src={product.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink">
                        <Highlight text={product.name} query={debouncedQuery} />
                      </span>
                      <span className="block text-xs capitalize text-muted">{product.category}</span>
                    </span>
                    <span className="text-xs font-extrabold text-ink">{formatCurrency(product.price)}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => choose(debouncedQuery)}
                  className="flex w-full items-center justify-between rounded-xl border-t border-line px-3 py-3 text-xs font-bold text-brand"
                >
                  See all results for “{debouncedQuery}”
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand/[.10] text-brand">
                  <Search className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-ink">No quick matches</p>
                <p className="mt-1 text-xs text-muted">Try a category, ingredient or snack name.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { ChevronDown, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { formatCurrency } from "@/lib/utils";
import type { CategorySlug } from "@/types/product";

export type CatalogFilters = {
  categories: CategorySlug[];
  maxPrice: number;
  rating: number;
  inStock: boolean;
  dealsOnly: boolean;
};

export const defaultFilters: CatalogFilters = {
  categories: [],
  maxPrice: 2000,
  rating: 0,
  inStock: false,
  dealsOnly: false,
};

export function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="divide-y divide-line">
      <div className="flex items-center justify-between pb-5">
        <div>
          <p className="font-display text-lg font-extrabold text-ink">Refine the shelf</p>
          <p className="mt-1 text-[0.66rem] text-muted">Choose what matters to you.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="px-2 text-muted">
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      </div>

      <details open className="group py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-ink marker:hidden">
          Category <ChevronDown className="size-4 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-3">
          {categories.map((category) => {
            const checked = filters.categories.includes(category.slug);
            return (
              <label key={category.slug} className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted transition hover:text-ink">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange({
                        ...filters,
                        categories: checked
                          ? filters.categories.filter((slug) => slug !== category.slug)
                          : [...filters.categories, category.slug],
                      })
                    }
                    className="size-4 rounded border-line accent-[rgb(var(--brand))]"
                  />
                  {category.name}
                </span>
                <span className="size-2 rounded-full" style={{ background: category.accent }} />
              </label>
            );
          })}
        </div>
      </details>

      <details open className="group py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-ink marker:hidden">
          Maximum price <ChevronDown className="size-4 transition group-open:rotate-180" />
        </summary>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted"><span>₹0</span><strong className="text-ink">{formatCurrency(filters.maxPrice)}</strong></div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
            className="range-input mt-3 w-full"
            aria-label="Maximum product price"
          />
        </div>
      </details>

      <details open className="group py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-ink marker:hidden">
          Customer rating <ChevronDown className="size-4 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-2">
          {[4.5, 4, 0].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-muted hover:bg-brand/5 hover:text-ink">
              <input type="radio" name="rating" checked={filters.rating === rating} onChange={() => onChange({ ...filters, rating })} className="accent-[rgb(var(--brand))]" />
              {rating ? `${rating}+ stars` : "All ratings"}
            </label>
          ))}
        </div>
      </details>

      <div className="space-y-3 py-5">
        <label className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink">
          In stock only
          <span className="relative inline-flex h-6 w-11 items-center">
            <input type="checkbox" checked={filters.inStock} onChange={(event) => onChange({ ...filters, inStock: event.target.checked })} className="peer sr-only" />
            <span className="absolute inset-0 rounded-full bg-line transition peer-checked:bg-brand" />
            <span className="relative ml-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink">
          Deals only
          <span className="relative inline-flex h-6 w-11 items-center">
            <input type="checkbox" checked={filters.dealsOnly} onChange={(event) => onChange({ ...filters, dealsOnly: event.target.checked })} className="peer sr-only" />
            <span className="absolute inset-0 rounded-full bg-line transition peer-checked:bg-brand" />
            <span className="relative ml-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </div>
    </div>
  );
}

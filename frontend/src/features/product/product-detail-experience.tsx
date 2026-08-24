"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { FrequentlyBought } from "@/features/product/frequently-bought";
import { ProductPurchasePanel } from "@/features/product/product-purchase-panel";
import { ProductTabs } from "@/features/product/product-tabs";
import { ProductViewer } from "@/features/product/product-viewer";
import { getProductBySlug, products } from "@/data/products";
import { useShopStore } from "@/store/shop-store";
import type { Product } from "@/types/product";

export function ProductDetailExperience({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.value ?? "classic");
  const recentSlugs = useShopStore((state) => state.recentlyViewed);
  const recordRecentlyViewed = useShopStore((state) => state.recordRecentlyViewed);
  const selectedColor = product.variants.find((variant) => variant.value === selectedVariant)?.swatch ?? product.accent;

  useEffect(() => {
    recordRecentlyViewed(product.slug);
  }, [product.slug, recordRecentlyViewed]);

  const companions = useMemo(() => {
    const sameCategory = products.filter((item) => item.category === product.category && item.id !== product.id);
    const contrast = products.find((item) => item.category !== product.category && item.bestSeller);
    return [product, ...sameCategory.slice(0, 1), ...(contrast ? [contrast] : [])].slice(0, 3);
  }, [product]);

  const recent = recentSlugs
    .filter((slug) => slug !== product.slug)
    .map(getProductBySlug)
    .filter((item): item is Product => Boolean(item))
    .slice(0, 4);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,.85fr)] lg:items-start xl:gap-12">
        <ProductViewer product={product} color={selectedColor} />
        <ProductPurchasePanel product={product} selectedVariant={selectedVariant} onVariantChange={setSelectedVariant} />
      </div>
      <ProductTabs product={product} />
      <FrequentlyBought items={companions} />
      {recent.length > 0 && (
        <section className="mt-14">
          <p className="eyebrow">Your recent shelf</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Recently viewed.</h2>
          <div className="scrollbar-none mt-6 flex gap-4 overflow-x-auto pb-6 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {recent.map((item) => <ProductCard key={item.id} product={item} className="w-[76vw] max-w-[18rem] shrink-0 lg:w-auto lg:max-w-none" />)}
          </div>
        </section>
      )}
    </>
  );
}

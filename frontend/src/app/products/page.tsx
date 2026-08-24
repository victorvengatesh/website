import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductCardSkeleton } from "@/components/commerce/product-card-skeleton";
import { ProductsClient } from "@/features/catalog/products-client";

export const metadata: Metadata = {
  title: "Shop all snacks",
  description: "Browse savouries, chips, sweets, millet snacks, bakery favourites and premium gift boxes.",
};

function CatalogFallback() {
  return (
    <div className="page-shell section-space grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <ProductsClient />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/features/search/search-results";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Namma Bites pantry for snacks, sweets and gift boxes.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page-shell min-h-[60vh] py-20 text-sm text-muted">Searching the fresh shelf…</div>}>
      <SearchResults />
    </Suspense>
  );
}

import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="page-shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand/[.10] text-brand"><PackageSearch className="size-8" /></div>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink">This snack left the shelf.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">It may be between batches. The rest of the pantry still has plenty worth discovering.</p>
        <Link href="/products" className={buttonStyles({ className: "mt-6" })}>Browse all products</Link>
      </div>
    </div>
  );
}

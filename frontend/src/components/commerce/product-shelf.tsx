import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/types/product";

export function ProductShelf({
  eyebrow,
  title,
  description,
  products,
  href = "/products",
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="section-space overflow-hidden">
      <div className="page-shell">
        <Reveal className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title mt-3">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          </div>
          <Link href={href} className="hidden items-center gap-2 text-xs font-extrabold text-brand transition hover:gap-3 sm:flex">
            See all <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="scrollbar-none -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-8 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {products.slice(0, 4).map((product, index) => (
            <Reveal key={product.id} delay={index * 0.06} className="w-[78vw] max-w-[19rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { ProductImage } from "@/components/ui/product-image";
import { Rating } from "@/components/ui/rating";
import { cn, discountPercent, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  layout = "grid",
  priority = false,
  className,
}: {
  product: Product;
  layout?: "grid" | "list";
  priority?: boolean;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const discount = discountPercent(product.price, product.compareAtPrice);

  function handleMove(event: MouseEvent<HTMLElement>) {
    if (reducedMotion || layout === "list") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: y * -3.2, y: x * 3.2 });
  }

  return (
    <motion.article
      layout
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 250, damping: 24 }}
      style={{ transformPerspective: 1000 }}
      className={cn(
        "group relative overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift",
        layout === "list" && "grid sm:grid-cols-[14rem_1fr]",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="relative block">
        <ProductImage
          src={product.image}
          alt={product.name}
          accent={product.accent}
          priority={priority}
          className={cn("aspect-[1.04]", layout === "list" && "h-full min-h-56")}
        />
        <span className="absolute bottom-3 right-3 z-20 grid size-9 translate-y-2 place-items-center rounded-full bg-ink text-canvas opacity-0 shadow-soft transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
      <div className="absolute left-3 top-3 z-20 flex max-w-[70%] flex-wrap gap-1.5">
        {product.badge && (
          <span className="rounded-full bg-ink/[.88] px-2.5 py-1 text-[0.59rem] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-brand px-2.5 py-1 text-[0.59rem] font-extrabold uppercase tracking-[0.1em] text-white">
            {discount}% off
          </span>
        )}
      </div>
      <WishlistButton productId={product.id} className="absolute right-3 top-3 z-20" />

      <div className={cn("p-4 sm:p-5", layout === "list" && "flex flex-col justify-center sm:p-7")}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-brand">{product.category}</p>
          <Rating value={product.rating} count={product.reviewCount} compact />
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 font-display text-[1rem] font-extrabold leading-5 tracking-[-0.025em] text-ink transition group-hover:text-brand sm:text-[1.05rem]">
            {product.name}
          </h3>
        </Link>
        <p className={cn("mt-2 line-clamp-2 text-xs leading-5 text-muted", layout === "grid" && "hidden sm:block")}>
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <strong className="font-display text-lg font-extrabold tracking-tight text-ink">{formatCurrency(product.price)}</strong>
            {product.compareAtPrice && (
              <span className="ml-2 text-[0.68rem] text-muted line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
            <span className="mt-0.5 block text-[0.6rem] text-muted">{product.weight} · incl. taxes</span>
          </div>
          <AddToCartButton product={product} label="Add" className="h-10 px-3 text-xs sm:px-4" />
        </div>
      </div>
    </motion.article>
  );
}

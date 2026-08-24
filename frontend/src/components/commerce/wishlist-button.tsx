"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const notify = useShopStore((state) => state.notify);
  const active = wishlist.includes(productId);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.82 }}
      animate={active ? { scale: [1, 1.24, 1] } : { scale: 1 }}
      onClick={(event) => {
        event.preventDefault();
        toggleWishlist(productId);
        notify({
          title: active ? "Removed from wishlist" : "Saved to wishlist",
          tone: "info",
        });
      }}
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line bg-surface/[.90] text-muted shadow-soft backdrop-blur transition hover:border-brand/[.30] hover:text-brand",
        active && "border-brand/[.30] bg-brand text-white hover:text-white",
        className,
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
    >
      <Heart className={cn("size-[1.05rem]", active && "fill-current")} />
      {active && (
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-brand/[.50]" aria-hidden="true" />
      )}
    </motion.button>
  );
}

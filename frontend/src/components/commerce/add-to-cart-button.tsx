"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";
import type { Product } from "@/types/product";

function animateToCart(source: DOMRect, color: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector("#site-cart-button")?.getBoundingClientRect();
  if (!target) return;

  const orb = document.createElement("div");
  orb.setAttribute("aria-hidden", "true");
  Object.assign(orb.style, {
    position: "fixed",
    zIndex: "120",
    left: `${source.left + source.width / 2 - 11}px`,
    top: `${source.top + source.height / 2 - 11}px`,
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: color,
    boxShadow: `0 8px 24px ${color}66`,
    pointerEvents: "none",
  });
  document.body.appendChild(orb);

  const deltaX = target.left + target.width / 2 - (source.left + source.width / 2);
  const deltaY = target.top + target.height / 2 - (source.top + source.height / 2);
  const animation = orb.animate(
    [
      { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
      { transform: `translate3d(${deltaX * 0.46}px,${deltaY * 0.15 - 80}px,0) scale(.86)`, opacity: 1, offset: 0.44 },
      { transform: `translate3d(${deltaX}px,${deltaY}px,0) scale(.25)`, opacity: 0.2 },
    ],
    { duration: 620, easing: "cubic-bezier(.2,.8,.25,1)" },
  );
  animation.addEventListener("finish", () => orb.remove());
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant,
  label = "Add",
  full = false,
  className,
}: {
  product: Product;
  quantity?: number;
  variant?: string;
  label?: string;
  full?: boolean;
  className?: string;
}) {
  const addToCart = useShopStore((state) => state.addToCart);
  const notify = useShopStore((state) => state.notify);

  return (
    <Button
      className={cn(full && "w-full", className)}
      disabled={product.stock <= 0}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        animateToCart(rect, product.accent);
        addToCart(product, quantity, variant);
        notify({
          title: `${product.name} added`,
          description: "Fresh choice. It’s waiting in your cart.",
          tone: "success",
        });
      }}
    >
      <ShoppingBag className="size-4" />
      {product.stock > 0 ? label : "Sold out"}
    </Button>
  );
}

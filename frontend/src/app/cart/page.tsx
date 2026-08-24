import type { Metadata } from "next";

import { CartPageClient } from "@/features/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Shopping cart",
  description: "Review your Namma Bites cart, update quantities and continue to secure checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}

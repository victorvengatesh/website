import type { Metadata } from "next";

import { CheckoutFlow } from "@/features/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your delivery details and review your Namma Bites order.",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}

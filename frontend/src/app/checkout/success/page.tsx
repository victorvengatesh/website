import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderSuccess } from "@/features/checkout/order-success";

export const metadata: Metadata = {
  title: "Order received",
  description: "Your Namma Bites order has been received and is awaiting store confirmation.",
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="page-shell grid min-h-[70vh] place-items-center text-sm text-muted">Preparing your confirmation…</div>}>
      <OrderSuccess />
    </Suspense>
  );
}

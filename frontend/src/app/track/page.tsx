import type { Metadata } from "next";
import { Suspense } from "react";

import { TrackingPage } from "@/features/tracking/tracking-page";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Follow your Namma Bites order from store confirmation to delivery.",
};

export default function TrackPage() {
  return <Suspense fallback={<div className="page-shell grid min-h-[60vh] place-items-center text-sm text-muted">Opening order tracking…</div>}><TrackingPage /></Suspense>;
}

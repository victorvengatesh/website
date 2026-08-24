import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <article className="page-shell section-space max-w-4xl"><p className="eyebrow">Legal</p><h1 className="section-title mt-3">Store terms.</h1><div className="mt-8 space-y-6 text-sm leading-7 text-muted"><p>This is a demonstration storefront. Replace these provisional terms with business-specific terms reviewed for the jurisdictions where the shop operates before taking orders.</p><h2 className="font-display text-xl font-extrabold text-ink">Order confirmation</h2><p>Submitting an order requests store review. Availability, delivery radius and ETA are confirmed by the shop before fulfilment. Pricing and stock must be validated by the backend at the time of order.</p><h2 className="font-display text-xl font-extrabold text-ink">Food and allergens</h2><p>Product pages provide indicative ingredients and dietary notes. Production labels and allergen statements must match the actual recipe and facility handling practices.</p></div></article>;
}

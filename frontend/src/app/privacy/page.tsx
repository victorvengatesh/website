import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <article className="page-shell section-space max-w-4xl"><p className="eyebrow">Legal</p><h1 className="section-title mt-3">Privacy, in plain language.</h1><div className="mt-8 space-y-6 text-sm leading-7 text-muted"><p>This storefront is currently a demonstration build. Cart, wishlist, profile previews and demo orders are stored in your browser. A production launch must publish a complete privacy policy naming the business entity, processors, retention periods and data-subject contact.</p><h2 className="font-display text-xl font-extrabold text-ink">Location</h2><p>Precise location is requested only during checkout to estimate the delivery distance. Browsers require explicit permission. Production systems should transmit it over HTTPS and retain it only for order fulfilment and legally required records.</p><h2 className="font-display text-xl font-extrabold text-ink">Payments and accounts</h2><p>No real payments or account authentication are enabled in this build. Connect server-side providers and update this notice before collecting customer information.</p></div></article>;
}

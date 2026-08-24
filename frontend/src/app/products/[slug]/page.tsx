import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { ProductShelf } from "@/components/commerce/product-shelf";
import { getProductBySlug, products } from "@/data/products";
import { ProductDetailExperience } from "@/features/product/product-detail-experience";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Namma Bites" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <div className="page-shell pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted">
          <Link href="/" className="hover:text-brand">Home</Link><ChevronRight className="size-3" />
          <Link href="/products" className="hover:text-brand">Shop</Link><ChevronRight className="size-3" />
          <Link href={`/products?category=${product.category}`} className="capitalize hover:text-brand">{product.category}</Link><ChevronRight className="size-3" />
          <span className="truncate text-ink">{product.name}</span>
        </nav>
      </div>
      <div className="page-shell section-space pt-6 sm:pt-8">
        <ProductDetailExperience product={product} />
      </div>
      {related.length > 0 && <ProductShelf eyebrow="Keep exploring" title="Customers also viewed." description="More fresh picks from the same corner of the pantry." products={related} href={`/products?category=${product.category}`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

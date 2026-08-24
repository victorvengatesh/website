import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";

import "./globals.css";

import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";
import { Providers } from "@/components/providers";
import { theme } from "@/config/theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://nammabites.example"),
  title: {
    default: `${theme.brand.name} — Small-batch snacks, delivered fresh`,
    template: `%s · ${theme.brand.name}`,
  },
  description: theme.brand.description,
  keywords: [
    "South Indian snacks",
    "murukku",
    "banana chips",
    "Indian sweets",
    "local snack delivery",
    "snack gift boxes",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: theme.brand.name,
    title: `${theme.brand.name} — Small-batch joy, delivered fresh`,
    description: theme.brand.description,
    images: [
      {
        url: "/images/categories/gifting.svg",
        width: 800,
        height: 800,
        alt: `${theme.brand.name} premium snack collection`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: theme.brand.name,
    description: theme.brand.description,
    images: ["/images/categories/gifting.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff9f0" },
    { media: "(prefers-color-scheme: dark)", color: "#161210" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: theme.brand.name,
    description: theme.brand.description,
    priceRange: "₹₹",
    servesCuisine: "South Indian snacks and sweets",
    telephone: theme.commerce.supportPhone,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <a href="#main-content" className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">
            Skip to content
          </a>
          <Header />
          <div id="main-content">
            <PageTransition>{children}</PageTransition>
          </div>
          <Footer />
          <CartDrawer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}

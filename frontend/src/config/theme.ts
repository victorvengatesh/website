/**
 * Single source of truth for brand-facing values used by metadata and UI copy.
 * Visual tokens live beside these values in app/globals.css so a full rebrand
 * only requires changing this file and the :root CSS custom properties.
 */
export const theme = {
  brand: {
    name: "Namma Bites",
    shortName: "NB",
    strapline: "Small-batch joy, delivered fresh.",
    description:
      "Premium South Indian snacks, sweets and thoughtful gift boxes made in small batches and delivered locally.",
  },
  fonts: {
    heading: "Manrope Variable",
    body: "Inter Variable",
  },
  radii: {
    card: "1.75rem",
    control: "0.9rem",
  },
  commerce: {
    currency: "INR",
    locale: "en-IN",
    freeShippingThreshold: 499,
    supportPhone: "+91 98765 43210",
    supportEmail: "hello@nammabites.example",
  },
  social: {
    instagram: "#",
    whatsapp: "#",
  },
} as const;

export type ThemeConfig = typeof theme;

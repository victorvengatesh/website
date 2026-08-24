export type CategorySlug =
  | "savouries"
  | "chips"
  | "sweets"
  | "millet"
  | "bakery"
  | "gifting";

export type ProductVariant = {
  name: string;
  value: string;
  swatch: string;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  gallery: string[];
  accent: string;
  badge?: string;
  weight: string;
  ingredients: string[];
  dietary: string[];
  variants: ProductVariant[];
  featured?: boolean;
  bestSeller?: boolean;
  deal?: boolean;
  newArrival?: boolean;
  modelUrl?: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  accent: string;
};

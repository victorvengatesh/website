import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { theme } from "@/config/theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat(theme.commerce.locale, {
    style: "currency",
    currency: theme.commerce.currency,
    maximumFractionDigits: 0,
  }).format(value);

export const discountPercent = (price: number, compareAtPrice?: number) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

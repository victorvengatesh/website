export const CATEGORY_MAP = {
  MIX: "Mixtures",
  MUR: "Murukku",
  BAN: "Chips",
  PEA: "Peanuts",
  LAD: "Sweets",
  HAL: "Halwa",
};

export const ALL_CATEGORIES = [
  "Mixtures",
  "Murukku",
  "Chips",
  "Peanuts",
  "Sweets",
  "Halwa",
];

export function getProductCategory(product) {
  if (!product.sku) return "Snacks";
  const prefix = product.sku.split("-")[0].toUpperCase();
  return CATEGORY_MAP[prefix] || "Snacks";
}

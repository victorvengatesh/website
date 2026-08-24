import { describe, expect, it } from "vitest";

import { categories, products, searchProducts } from "@/data/products";

describe("catalog data", () => {
  it("contains exactly 30 products across six balanced categories", () => {
    expect(products).toHaveLength(30);
    expect(categories).toHaveLength(6);
    categories.forEach((category) => {
      expect(products.filter((product) => product.category === category.slug)).toHaveLength(5);
    });
  });

  it("uses unique stable identifiers", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.sku)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.slug)).size).toBe(products.length);
  });

  it("keeps all commerce fields valid", () => {
    products.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeGreaterThanOrEqual(1);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.gallery.length).toBeGreaterThanOrEqual(3);
      expect(product.variants.length).toBeGreaterThan(0);
    });
  });

  it("searches names, categories and ingredients case-insensitively", () => {
    expect(searchProducts("MURUKKU").length).toBeGreaterThan(0);
    expect(searchProducts("millet").length).toBeGreaterThanOrEqual(5);
    expect(searchProducts("pistachio").length).toBeGreaterThan(0);
    expect(searchProducts("not-a-real-snack")).toEqual([]);
  });
});

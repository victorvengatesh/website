import {
  getProductBySlug,
  products,
  searchProducts,
} from "@/data/products";
import type { Product } from "@/types/product";

export type CatalogService = {
  list: () => Promise<Product[]>;
  getBySlug: (slug: string) => Promise<Product | undefined>;
  search: (query: string) => Promise<Product[]>;
};

/**
 * Mock-first catalog adapter. Replace this object with a REST or GraphQL
 * implementation without changing the page and component layers.
 */
export const catalogService: CatalogService = {
  async list() {
    return products;
  },
  async getBySlug(slug) {
    return getProductBySlug(slug);
  },
  async search(query) {
    return searchProducts(query);
  },
};

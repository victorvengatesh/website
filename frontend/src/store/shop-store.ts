import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/types/product";

export type CartLine = {
  product: Product;
  quantity: number;
  variant: string;
};

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "info" | "error";
};

type ThemeMode = "light" | "dark";

export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
};

type ShopState = {
  cart: CartLine[];
  savedForLater: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  isCartOpen: boolean;
  theme: ThemeMode;
  user: UserProfile | null;
  toasts: ToastMessage[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  saveForLater: (productId: string, variant?: string) => void;
  moveToCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  recordRecentlyViewed: (slug: string) => void;
  openCart: () => void;
  closeCart: () => void;
  setTheme: (theme: ThemeMode) => void;
  signIn: (user: UserProfile) => void;
  signOut: () => void;
  notify: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
};

const sameLine = (line: CartLine, productId: string, variant?: string) =>
  line.product.id === productId && (!variant || line.variant === variant);

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      savedForLater: [],
      wishlist: [],
      recentlyViewed: [],
      isCartOpen: false,
      theme: "light",
      user: null,
      toasts: [],
      addToCart: (product, quantity = 1, variant = product.variants[0]?.value ?? "default") =>
        set((state) => {
          const existing = state.cart.find((line) =>
            sameLine(line, product.id, variant),
          );
          const cart = existing
            ? state.cart.map((line) =>
                sameLine(line, product.id, variant)
                  ? {
                      ...line,
                      quantity: Math.min(
                        line.quantity + quantity,
                        line.product.stock,
                      ),
                    }
                  : line,
              )
            : [
                ...state.cart,
                {
                  product,
                  quantity: Math.min(quantity, product.stock),
                  variant,
                },
              ];

          return { cart, isCartOpen: true };
        }),
      updateQuantity: (productId, quantity, variant) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((line) => !sameLine(line, productId, variant))
              : state.cart.map((line) =>
                  sameLine(line, productId, variant)
                    ? {
                        ...line,
                        quantity: Math.min(quantity, line.product.stock),
                      }
                    : line,
                ),
        })),
      removeFromCart: (productId, variant) =>
        set((state) => ({
          cart: state.cart.filter((line) => !sameLine(line, productId, variant)),
        })),
      saveForLater: (productId, variant) =>
        set((state) => {
          const line = state.cart.find((item) => sameLine(item, productId, variant));
          if (!line) return state;
          return {
            cart: state.cart.filter((item) => !sameLine(item, productId, variant)),
            savedForLater: [
              line,
              ...state.savedForLater.filter(
                (item) => !sameLine(item, productId, variant),
              ),
            ],
          };
        }),
      moveToCart: (productId, variant) =>
        set((state) => {
          const line = state.savedForLater.find((item) =>
            sameLine(item, productId, variant),
          );
          if (!line) return state;
          return {
            savedForLater: state.savedForLater.filter(
              (item) => !sameLine(item, productId, variant),
            ),
            cart: [line, ...state.cart],
          };
        }),
      clearCart: () => set({ cart: [], isCartOpen: false }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [productId, ...state.wishlist],
        })),
      recordRecentlyViewed: (slug) =>
        set((state) => ({
          recentlyViewed: [
            slug,
            ...state.recentlyViewed.filter((item) => item !== slug),
          ].slice(0, 8),
        })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      setTheme: (theme) => set({ theme }),
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      notify: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              ...toast,
              id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            },
          ].slice(-4),
        })),
      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    }),
    {
      name: "namma-bites-shop",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        cart: state.cart,
        savedForLater: state.savedForLater,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        theme: state.theme,
        user: state.user,
      }),
    },
  ),
);

export const cartItemCount = (lines: CartLine[]) =>
  lines.reduce((total, line) => total + line.quantity, 0);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce(
    (total, line) => total + line.product.price * line.quantity,
    0,
  );

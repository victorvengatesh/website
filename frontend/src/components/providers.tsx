"use client";

import { useEffect } from "react";

import { ToastViewport } from "@/components/ui/toast-viewport";
import { useShopStore } from "@/store/shop-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useShopStore((state) => state.theme);

  useEffect(() => {
    void useShopStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <>
      {children}
      <ToastViewport />
    </>
  );
}

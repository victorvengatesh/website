"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { useShopStore } from "@/store/shop-store";

const icons = {
  success: CheckCircle2,
  info: Info,
  error: TriangleAlert,
};

function ToastItem({ id }: { id: string }) {
  const toast = useShopStore((state) =>
    state.toasts.find((item) => item.id === id),
  );
  const dismissToast = useShopStore((state) => state.dismissToast);

  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(id), 4200);
    return () => window.clearTimeout(timer);
  }, [dismissToast, id]);

  if (!toast) return null;
  const Icon = icons[toast.tone ?? "success"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-line bg-surface/[.95] p-4 text-ink shadow-lift backdrop-blur-xl"
      role="status"
    >
      <Icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs leading-5 text-muted">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => dismissToast(id)}
        className="rounded-full p-1 text-muted transition hover:bg-ink/5 hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}

export function ToastViewport() {
  // Select the persisted array itself. Returning a freshly mapped array from a
  // Zustand selector creates an unstable useSyncExternalStore snapshot in
  // React 19 and can trigger an infinite render loop during hydration.
  const toasts = useShopStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-end gap-2 px-4 sm:inset-x-auto sm:right-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem id={toast.id} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

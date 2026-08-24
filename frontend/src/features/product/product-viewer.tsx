"use client";

import { PointerEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, ImageIcon, Move3d, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const ProductScene = dynamic(() => import("@/components/three/product-scene"), {
  ssr: false,
  loading: () => <div className="size-14 animate-spin rounded-full border-2 border-brand/[.20] border-t-brand motion-reduce:animate-none" />,
});

export function ProductViewer({ product, color }: { product: Product; color: string }) {
  const [mode, setMode] = useState<"3d" | "gallery">("gallery");
  const [canRender3d, setCanRender3d] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const capable = !reduced && navigator.hardwareConcurrency > 4 && memory > 4;
    queueMicrotask(() => {
      setCanRender3d(capable);
      if (capable) setMode("3d");
    });
  }, []);

  function moveZoom(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    });
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2.25rem] border border-line bg-[radial-gradient(circle_at_50%_35%,#fffdf5_0%,#f7e5cc_54%,#ecd3b2_100%)] shadow-soft dark:bg-[radial-gradient(circle_at_50%_35%,#49372e_0%,#2d231f_58%,#201916_100%)]">
        <AnimatePresence mode="wait">
          {mode === "3d" && canRender3d ? (
            <motion.div key={`3d-${color}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid size-full place-items-center">
              <ProductScene category={product.category} color={color} />
            </motion.div>
          ) : (
            <motion.div
              key={`gallery-${activeImage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onPointerMove={moveZoom}
              onPointerLeave={() => setZoom((value) => ({ ...value, active: false }))}
              className="relative size-full cursor-zoom-in overflow-hidden"
            >
              <Image src={product.gallery[activeImage]} alt={`${product.name}, view ${activeImage + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              {zoom.active && (
                <div className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block" style={{ backgroundImage: `url(${product.gallery[activeImage]})`, backgroundPosition: `${zoom.x}% ${zoom.y}%`, backgroundSize: "190%" }} aria-hidden="true" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute left-4 top-4 z-20 flex rounded-full border border-white/[.55] bg-surface/[.82] p-1 shadow-soft backdrop-blur-xl">
          <button type="button" onClick={() => canRender3d && setMode("3d")} disabled={!canRender3d} className={cn("flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-muted transition", mode === "3d" && "bg-ink text-canvas", !canRender3d && "cursor-not-allowed opacity-[.45]")} aria-pressed={mode === "3d"} title={!canRender3d ? "3D is disabled for reduced motion or lower-powered devices" : undefined}>
            <Box className="size-3.5" /> 3D
          </button>
          <button type="button" onClick={() => setMode("gallery")} className={cn("flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-muted transition", mode === "gallery" && "bg-ink text-canvas")} aria-pressed={mode === "gallery"}>
            <ImageIcon className="size-3.5" /> Photos
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[.45] bg-ink/[.52] px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.11em] text-white backdrop-blur">
          {mode === "3d" && canRender3d ? <><Move3d className="size-3.5" /> Drag · pinch · zoom</> : <><ZoomIn className="size-3.5" /> Hover to inspect</>}
        </div>
      </div>

      {mode === "gallery" && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {product.gallery.map((image, index) => (
            <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} className={cn("relative aspect-[1.25] overflow-hidden rounded-2xl border-2 bg-canvas transition", activeImage === index ? "border-brand" : "border-transparent hover:border-brand/[.35]")} aria-label={`Show product view ${index + 1}`} aria-pressed={activeImage === index}>
              <Image src={image} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

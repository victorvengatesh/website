"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Clock3, PackageCheck } from "lucide-react";
import { motion } from "framer-motion";

import { buttonStyles } from "@/components/ui/button";

const confetti = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  delay: (index % 8) * 0.08,
  rotate: (index * 47) % 240,
  color: ["#e95322", "#f6be41", "#176a73", "#d83b58"][index % 4],
}));

export function OrderSuccess() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "NB-PREVIEW";

  return (
    <div className="page-shell relative grid min-h-[72vh] place-items-center overflow-hidden py-16 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden" aria-hidden="true">
        {confetti.map((piece, index) => (
          <motion.span
            key={index}
            initial={{ y: -30, opacity: 0, rotate: 0 }}
            animate={{ y: [0, 190, 360], opacity: [0, 1, 0], rotate: piece.rotate }}
            transition={{ duration: 2.2, delay: piece.delay, ease: "easeOut" }}
            className="absolute top-0 h-4 w-2 rounded-sm"
            style={{ left: piece.left, background: piece.color }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10 max-w-2xl">
        <div className="relative mx-auto h-40 w-44" aria-hidden="true">
          <motion.div initial={{ y: 0 }} animate={{ y: -18, rotateX: 50 }} transition={{ delay: 0.35, duration: 0.7, type: "spring" }} className="absolute left-3 top-7 h-16 w-[9.5rem] origin-bottom rounded-xl bg-accent shadow-soft" />
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.65, duration: 0.4 }} className="absolute left-1/2 top-5 z-10 h-16 w-1 origin-bottom -translate-x-1/2 bg-brand" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.75, type: "spring" }} className="absolute left-1/2 top-0 z-20 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-success text-white shadow-lift"><Check className="size-6" /></motion.div>
          <div className="absolute bottom-0 left-3 h-24 w-[9.5rem] rounded-b-2xl rounded-t-md bg-brand-gradient shadow-lift"><div className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 bg-accent/[.90]" /></div>
        </div>
        <p className="eyebrow mt-4">Order received</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.055em] text-ink sm:text-6xl">Your fresh box is in motion.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">The store is checking the batch and your delivery distance. You’ll see a confirmed ETA as soon as the order is accepted.</p>
        <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft">
          <div className="text-left"><span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted">Order reference</span><strong className="mt-1 block break-all text-xs text-ink">{orderId}</strong></div>
          <div className="border-l border-line pl-4 text-left"><span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted">Current status</span><strong className="mt-1 flex items-center gap-1.5 text-xs text-brand"><Clock3 className="size-3.5" /> Awaiting confirmation</strong></div>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/track?order=${encodeURIComponent(orderId)}`} className={buttonStyles({ size: "lg" })}><PackageCheck className="size-4" /> Track this order</Link>
          <Link href="/products" className={buttonStyles({ variant: "secondary", size: "lg" })}>Keep browsing <ArrowRight className="size-4" /></Link>
        </div>
      </motion.div>
    </div>
  );
}

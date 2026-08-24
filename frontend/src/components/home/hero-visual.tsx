"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Cuboid, Move3d } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

function SceneLoader() {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <div className="mx-auto size-12 animate-spin rounded-full border-2 border-brand/[.20] border-t-brand motion-reduce:animate-none" />
        <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted">Preparing the fresh batch</p>
      </div>
    </div>
  );
}

function PosterFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image src="/images/categories/savoury.svg" alt="Illustrated bowl of Namma Bites savouries" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/[.15] via-transparent to-white/[.15]" />
    </div>
  );
}

export function HeroVisual() {
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    queueMicrotask(() => setFallback(reduced || navigator.hardwareConcurrency <= 4 || memory <= 4));
  }, []);

  return (
    <div className="relative h-[27rem] overflow-hidden rounded-[2.2rem] border border-white/[.55] bg-[radial-gradient(circle_at_50%_42%,#ffe4a3_0%,#f6b85d_30%,#e45a2b_70%,#8e2c1c_100%)] shadow-[0_34px_100px_rgba(128,48,23,.32)] sm:h-[34rem] lg:h-[39rem]">
      {fallback ? <PosterFallback /> : <HeroScene />}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[.25]" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/[.25] bg-ink/[.20] px-3 py-2 text-[0.61rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:left-6 sm:top-6">
        {fallback ? <Cuboid className="size-3.5" /> : <Move3d className="size-3.5" />}
        {fallback ? "Optimised visual" : "Move to explore"}
      </div>
      <div className="absolute bottom-5 right-5 rounded-2xl border border-white/[.30] bg-white/[.18] px-4 py-3 text-white backdrop-blur-xl sm:bottom-7 sm:right-7">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/[.65]">Today’s batch</p>
        <p className="mt-1 font-display text-lg font-extrabold">Packed at 9:20 AM</p>
      </div>
    </div>
  );
}

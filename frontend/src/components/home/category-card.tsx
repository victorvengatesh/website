"use client";

import { MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Category } from "@/types/product";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const reducedMotion = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function move(event: MouseEvent<HTMLElement>) {
    if (reducedMotion) return;
    const box = event.currentTarget.getBoundingClientRect();
    setRotate({
      x: ((event.clientY - box.top) / box.height - 0.5) * -8,
      y: ((event.clientX - box.left) / box.width - 0.5) * 8,
    });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.055, duration: 0.5 }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      onMouseMove={move}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{ transformPerspective: 900 }}
      className="group"
    >
      <Link href={`/products?category=${category.slug}`} className="relative block aspect-[.88] overflow-hidden rounded-card shadow-soft transition-shadow duration-500 hover:shadow-lift">
        <Image src={category.image} alt={`${category.name} collection`} fill sizes="(max-width: 768px) 50vw, 17vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/[.70] via-black/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/[.68]">{category.eyebrow}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{category.name}</h3>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/[.30] bg-white/[.15] backdrop-blur transition group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

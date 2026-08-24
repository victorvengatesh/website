"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";

import { OrderTimeline } from "@/components/commerce/order-timeline";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/utils";

type StoredOrder = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  itemCount: number;
  items: Array<{ name: string; quantity: number; image: string }>;
};

const demoOrder: StoredOrder = {
  id: "NB-DEMO142",
  createdAt: "2026-08-23T10:00:00.000Z",
  status: "preparing",
  total: 427,
  itemCount: 3,
  items: [
    { name: products[0].name, quantity: 2, image: products[0].image },
    { name: products[5].name, quantity: 1, image: products[5].image },
  ],
};

export function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([demoOrder]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("namma-bites-orders") ?? "[]") as StoredOrder[];
    if (stored.length) queueMicrotask(() => setOrders(stored));
  }, []);

  return (
    <div>
      <p className="eyebrow">Order history</p><h1 className="section-title mt-3">Every box, one clear journey.</h1><p className="mt-3 text-sm text-muted">Live backend statuses appear here once authentication and order ownership are connected.</p>
      <div className="mt-8 space-y-5">
        {orders.map((order, index) => (
          <motion.article key={order.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} className="rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[0.61rem] font-bold uppercase tracking-[0.12em] text-muted">Order {order.id}</p><p className="mt-1 text-xs text-muted">Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div><div className="text-right"><strong className="font-display text-xl font-extrabold text-ink">{formatCurrency(order.total)}</strong><p className="text-[0.62rem] text-muted">{order.itemCount} items</p></div></div>
            <OrderTimeline status={order.status} />
            <div className="mt-6 flex items-center justify-between border-t border-line pt-4"><div className="flex -space-x-2">{order.items.slice(0, 3).map((item, itemIndex) => <span key={`${item.name}-${itemIndex}`} className="relative size-10 overflow-hidden rounded-full border-2 border-surface bg-canvas"><Image src={item.image} alt="" fill sizes="40px" className="object-cover" /></span>)}</div><Link href={`/track?order=${encodeURIComponent(order.id)}`} className="flex items-center gap-1 text-xs font-extrabold text-brand">View tracking <ChevronRight className="size-4" /></Link></div>
          </motion.article>
        ))}
      </div>
      {!orders.length && <div className="mt-8 grid min-h-80 place-items-center rounded-[2rem] border border-dashed border-line text-center"><div><PackageSearch className="mx-auto size-10 text-brand" /><p className="mt-4 font-display text-xl font-extrabold text-ink">No orders yet.</p></div></div>}
    </div>
  );
}

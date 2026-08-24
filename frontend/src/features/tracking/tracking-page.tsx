"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock3, MapPin, PackageSearch, Phone, RefreshCcw, Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { OrderTimeline } from "@/components/commerce/order-timeline";
import { Button, buttonStyles } from "@/components/ui/button";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/services/api";
import type { Order } from "@/types/order";

const sampleOrder: Order = {
  id: "NB-DEMO142",
  status: "preparing",
  recipient_name: "Demo Customer",
  phone: "+91 98765 43210",
  address_line: "12, Sample Street, Your Area",
  city: "Karur",
  pincode: "639001",
  distance_km: 3.4,
  subtotal: 407,
  delivery_fee: 20,
  total: 427,
  eta_text: "About 35 minutes",
  created_at: "2026-08-23T10:00:00.000Z",
  items: [
    { product_name: products[0].name, quantity: 2, unit_price: products[0].price, line_total: products[0].price * 2 },
    { product_name: products[5].name, quantity: 1, unit_price: products[5].price, line_total: products[5].price },
  ],
};

function fromStoredOrder(id: string): Order | undefined {
  const stored = JSON.parse(localStorage.getItem("namma-bites-orders") ?? "[]") as Array<{ id: string; status: Order["status"]; recipient?: string; total: number; createdAt: string; items: Array<{ name: string; quantity: number }> }>;
  const found = stored.find((order) => order.id === id);
  if (!found) return undefined;
  return {
    id: found.id,
    status: found.status,
    recipient_name: found.recipient ?? "Customer",
    phone: "Saved at checkout",
    address_line: "Saved delivery address",
    city: "Your city",
    pincode: "—",
    subtotal: found.total,
    delivery_fee: 0,
    total: found.total,
    eta_text: "Awaiting store confirmation",
    created_at: found.createdAt,
    items: found.items.map((item, index) => ({ id: String(index), product_name: item.name, quantity: item.quantity, unit_price: 0, line_total: 0 })),
  };
}

export function TrackingPage() {
  const params = useSearchParams();
  const initial = params.get("order") ?? "";
  const [orderId, setOrderId] = useState(initial);
  const [order, setOrder] = useState<Order | null>(initial === "NB-DEMO142" ? sampleOrder : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = useCallback(async (id: string) => {
    const cleaned = id.trim();
    if (!cleaned) return;
    setLoading(true);
    setError("");
    try {
      if (cleaned === "NB-DEMO142") {
        setOrder(sampleOrder);
      } else {
        const stored = fromStoredOrder(cleaned);
        if (stored) setOrder(stored);
        else setOrder(await apiRequest<Order>(`/orders/${encodeURIComponent(cleaned)}`));
      }
    } catch (lookupError) {
      setOrder(null);
      setError(lookupError instanceof Error ? lookupError.message : "Order not found. Check the reference and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial && initial !== "NB-DEMO142") {
      const timer = window.setTimeout(() => void lookup(initial), 0);
      return () => window.clearTimeout(timer);
    }
  }, [initial, lookup]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void lookup(orderId);
  }

  return (
    <div className="page-shell section-space pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center"><p className="eyebrow">From kitchen to doorstep</p><h1 className="section-title mt-3">Track your fresh box.</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">Enter the reference from your confirmation. Status updates come directly from the shop workflow.</p></div>
        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-2xl gap-2 rounded-2xl border border-line bg-surface p-2 shadow-lift"><label htmlFor="order-reference" className="sr-only">Order reference</label><div className="relative flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" /><input id="order-reference" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Order reference, e.g. NB-DEMO142" className="h-12 w-full rounded-xl bg-canvas pl-11 pr-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand/[.30]" /></div><Button type="submit" disabled={loading} className="h-12">{loading ? <RefreshCcw className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}<span className="hidden sm:inline">Track</span></Button></form>
        <p className="mt-3 text-center text-[0.65rem] text-muted">Preview with <button type="button" onClick={() => { setOrderId("NB-DEMO142"); void lookup("NB-DEMO142"); }} className="font-extrabold text-brand">NB-DEMO142</button></p>

        {error && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-7 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/[.20] dark:text-red-300">{error}</motion.div>}

        {order ? (
          <motion.article initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="mt-9 overflow-hidden rounded-[2.2rem] border border-line bg-surface shadow-lift">
            <div className="bg-ink p-6 text-canvas sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-accent">Order {order.id}</p><h2 className="mt-2 font-display text-2xl font-extrabold text-white">{order.status === "pending_confirmation" ? "The store is checking your order." : order.status === "preparing" ? "Your snacks are being packed." : order.status === "out_for_delivery" ? "Freshness is on the road." : order.status === "delivered" ? "Delivered. Time to crunch." : "Order confirmed."}</h2></div><div className="rounded-2xl border border-white/[.12] bg-white/7 px-4 py-3"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-white/[.55]">Estimated arrival</p><p className="mt-1 flex items-center gap-2 text-sm font-extrabold text-white"><Clock3 className="size-4 text-accent" />{order.eta_text ?? "Awaiting confirmation"}</p></div></div><OrderTimeline status={order.status} /></div>
            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.13em] text-brand">Delivery details</p><div className="mt-4 space-y-3 text-xs text-muted"><p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" />{order.recipient_name}<br />{order.address_line}, {order.city} · {order.pincode}</p><p className="flex items-center gap-2"><Phone className="size-4 text-brand" />{order.phone}</p>{order.distance_km != null && <p className="flex items-center gap-2"><PackageSearch className="size-4 text-brand" />{order.distance_km} km from the store</p>}</div></div>
              <div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.13em] text-brand">Order summary</p><div className="mt-4 space-y-2">{order.items.map((item, index) => <div key={item.id ?? `${item.product_name}-${index}`} className="flex justify-between gap-4 text-xs text-muted"><span>{item.product_name} × {item.quantity}</span><span>{Number(item.line_total) ? formatCurrency(Number(item.line_total)) : "—"}</span></div>)}<div className="flex justify-between border-t border-line pt-3 text-sm font-extrabold text-ink"><span>Total</span><span>{formatCurrency(Number(order.total))}</span></div></div></div>
            </div>
          </motion.article>
        ) : !error && !loading && <div className="mt-10 grid min-h-72 place-items-center rounded-[2rem] border border-dashed border-line bg-surface/[.55] text-center"><div><ShoppingBag className="mx-auto size-9 text-brand" /><p className="mt-4 font-display text-xl font-extrabold text-ink">Your order journey will appear here.</p><p className="mt-2 text-xs text-muted">Use the reference from your confirmation page.</p></div></div>}
        <div className="mt-7 text-center"><Link href="/products" className={buttonStyles({ variant: "ghost" })}>Continue shopping</Link></div>
      </div>
    </div>
  );
}

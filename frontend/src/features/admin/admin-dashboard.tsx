"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Clock3, IndianRupee, MapPin, PackageCheck, RefreshCcw, Route, ShieldAlert, Store, Truck, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/services/api";
import type { Order, OrderStatus } from "@/types/order";

const sampleOrders: Order[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    status: "pending_confirmation",
    recipient_name: "Ananya Raman",
    phone: "+91 98765 43210",
    address_line: "12, Sample Street, Your Area",
    city: "Karur",
    pincode: "639001",
    distance_km: 3.4,
    subtotal: 407,
    delivery_fee: 20,
    total: 427,
    eta_text: null,
    created_at: "2026-08-24T08:42:00.000Z",
    items: [
      { product_name: "Signature Special Mixture", quantity: 2, unit_price: 129, line_total: 258 },
      { product_name: "Nendran Banana Chips", quantity: 1, unit_price: 149, line_total: 149 },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    status: "preparing",
    recipient_name: "Karthik Suresh",
    phone: "+91 98765 40120",
    address_line: "8, Market Road",
    city: "Karur",
    pincode: "639002",
    distance_km: 5.1,
    subtotal: 538,
    delivery_fee: 20,
    total: 558,
    eta_text: "35 minutes",
    created_at: "2026-08-24T08:20:00.000Z",
    items: [{ product_name: "Ghee Mysore Pak", quantity: 1, unit_price: 289, line_total: 289 }, { product_name: "Motichoor Laddu", quantity: 1, unit_price: 249, line_total: 249 }],
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    status: "out_for_delivery",
    recipient_name: "Meera Krishnan",
    phone: "+91 98765 40880",
    address_line: "21, River View Colony",
    city: "Karur",
    pincode: "639003",
    distance_km: 7.3,
    subtotal: 899,
    delivery_fee: 35,
    total: 934,
    eta_text: "15 minutes",
    created_at: "2026-08-24T07:50:00.000Z",
    items: [{ product_name: "Heritage Taster Box", quantity: 1, unit_price: 899, line_total: 899 }],
  },
];

const statusLabels: Record<OrderStatus, string> = {
  pending_confirmation: "Pending review",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

export function AdminDashboard() {
  const liveApi = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [etas, setEtas] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!liveApi) return;
    setLoading(true);
    try {
      setOrders(await apiRequest<Order[]>("/admin/orders"));
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not refresh orders.");
    } finally {
      setLoading(false);
    }
  }, [liveApi]);

  useEffect(() => {
    if (!liveApi) return;
    const initialLoad = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(load, 8000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [liveApi, load]);

  const stats = useMemo(() => ({
    pending: orders.filter((order) => order.status === "pending_confirmation").length,
    active: orders.filter((order) => ["confirmed", "preparing", "out_for_delivery"].includes(order.status)).length,
    revenue: orders.filter((order) => order.status !== "rejected" && order.status !== "cancelled").reduce((sum, order) => sum + Number(order.total), 0),
    distance: orders.length ? orders.reduce((sum, order) => sum + Number(order.distance_km ?? 0), 0) / orders.length : 0,
  }), [orders]);

  const statCards = [
    { icon: Clock3, label: "Pending review", value: stats.pending, color: "text-amber-600", background: "bg-amber-100 dark:bg-amber-900/[.25]" },
    { icon: PackageCheck, label: "Active orders", value: stats.active, color: "text-brand", background: "bg-brand/[.10]" },
    { icon: IndianRupee, label: "Open value", value: formatCurrency(stats.revenue), color: "text-success", background: "bg-success/[.10]" },
    { icon: Route, label: "Average distance", value: `${stats.distance.toFixed(1)} km`, color: "text-sky-600", background: "bg-sky-100 dark:bg-sky-900/[.25]" },
  ];

  async function accept(order: Order) {
    const eta = etas[order.id]?.trim() || "45 minutes";
    if (liveApi) {
      try {
        const updated = await apiRequest<Order>(`/admin/orders/${order.id}/accept`, { method: "PATCH", body: JSON.stringify({ eta_text: eta }) });
        setOrders((current) => current.map((item) => item.id === updated.id ? updated : item));
      } catch (acceptError) {
        setError(acceptError instanceof Error ? acceptError.message : "Could not accept order.");
      }
    } else {
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "confirmed", eta_text: eta } : item));
    }
  }

  async function updateStatus(order: Order, status: OrderStatus) {
    if (["cancelled", "rejected"].includes(status) && !window.confirm(`Mark this order ${status}? Inventory and refund logic will run on the backend.`)) return;
    if (liveApi) {
      try {
        const updated = await apiRequest<Order>(`/admin/orders/${order.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
        setOrders((current) => current.map((item) => item.id === updated.id ? updated : item));
      } catch (statusError) {
        setError(statusError instanceof Error ? statusError.message : "Could not update status.");
      }
    } else {
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#251e1a] dark:bg-[#171310] dark:text-[#fcf4ea]">
      <header className="border-b border-black/[.08] bg-[#211b18] text-white"><div className="page-shell flex h-[4.25rem] items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand"><Store className="size-5" /></span><div><p className="font-display text-base font-extrabold">Namma Bites Ops</p><p className="text-[0.58rem] uppercase tracking-[0.13em] text-white/[.48]">Store command centre</p></div></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] ${liveApi ? "bg-success/[.20] text-green-300" : "bg-accent/[.15] text-accent"}`}>{liveApi ? "Live API" : "Preview data"}</span><Button variant="secondary" size="sm" onClick={() => void load()} disabled={!liveApi || loading}><RefreshCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh</Button></div></div></header>
      <main className="page-shell py-8 sm:py-10">
        <div className="rounded-2xl border border-amber-300/[.40] bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-700/[.30] dark:bg-amber-950/[.20] dark:text-amber-200"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 size-5 shrink-0" /><span><strong>Production guardrail:</strong> this operational route must be protected with server-enforced admin authentication and RBAC before deployment.</span></div></div>
        {error && <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/[.20] dark:text-red-300"><AlertTriangle className="size-4" />{error}<button type="button" onClick={() => setError("")} className="ml-auto"><X className="size-4" /></button></div>}

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, label, value, color, background }) => <article key={label} className="rounded-[1.5rem] border border-black/7 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-[#261f1b] sm:p-5"><div className={`grid size-10 place-items-center rounded-xl ${background} ${color}`}><Icon className="size-5" /></div><p className="mt-4 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-black/[.48] dark:text-white/[.48]">{label}</p><strong className="mt-1 block font-display text-2xl font-extrabold">{value}</strong></article>)}
        </div>

        <div className="mt-9 flex items-end justify-between gap-5"><div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-brand">Live queue</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Today’s orders.</h1></div><p className="text-xs text-black/[.48] dark:text-white/[.48]">Auto-refreshes every 8 seconds with a live API.</p></div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {orders.map((order, index) => {
            const next = nextStatus[order.status];
            return <motion.article key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[1.7rem] border border-black/7 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#261f1b]">
              <div className="flex items-start justify-between gap-4"><div><p className="font-display text-lg font-extrabold">{order.recipient_name}</p><p className="mt-1 text-[0.65rem] text-black/[.48] dark:text-white/[.48]">{order.phone} · {new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p></div><span className={`rounded-full px-3 py-1.5 text-[0.58rem] font-extrabold uppercase tracking-[0.09em] ${order.status === "pending_confirmation" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/[.25] dark:text-amber-300" : order.status === "delivered" ? "bg-success/[.10] text-success" : "bg-brand/[.10] text-brand"}`}>{statusLabels[order.status]}</span></div>
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 rounded-2xl bg-[#f7f3ed] p-4 dark:bg-black/[.18]"><div><p className="flex items-start gap-2 text-xs leading-5 text-black/[.60] dark:text-white/[.58]"><MapPin className="mt-0.5 size-3.5 shrink-0 text-brand" />{order.address_line}, {order.city} · {order.pincode}</p><p className="mt-2 flex items-center gap-2 text-xs font-bold"><Truck className="size-3.5 text-brand" />{order.eta_text ?? "ETA not assigned"}</p></div><div className="text-right"><strong className="block font-display text-xl">{formatCurrency(Number(order.total))}</strong><span className="text-[0.6rem] text-black/[.45] dark:text-white/[.45]">{order.distance_km ?? "—"} km</span></div></div>
              <div className="mt-4 space-y-1.5">{order.items.map((item, itemIndex) => <div key={item.id ?? itemIndex} className="flex justify-between text-xs text-black/[.55] dark:text-white/[.55]"><span>{item.product_name} × {item.quantity}</span><span>{formatCurrency(Number(item.line_total))}</span></div>)}</div>
              {order.status === "pending_confirmation" ? <div className="mt-5 border-t border-black/7 pt-4 dark:border-white/8"><label className="text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-black/[.48] dark:text-white/[.48]">Assign ETA</label><div className="mt-2 flex gap-2"><select value={etas[order.id] ?? "45 minutes"} onChange={(event) => setEtas((current) => ({ ...current, [order.id]: event.target.value }))} className="h-10 flex-1 rounded-xl border border-black/[.10] bg-white px-3 text-xs font-bold dark:border-white/[.10] dark:bg-black/[.15]"><option>30 minutes</option><option>45 minutes</option><option>1 hour</option><option>Today evening</option></select><Button size="sm" onClick={() => void accept(order)}><Check className="size-3.5" /> Accept</Button><Button size="sm" variant="secondary" onClick={() => void updateStatus(order, "rejected")}>Reject</Button></div></div> : next ? <div className="mt-5 flex justify-end border-t border-black/7 pt-4 dark:border-white/8"><Button size="sm" onClick={() => void updateStatus(order, next)}>{next === "preparing" ? "Start preparing" : next === "out_for_delivery" ? "Send for delivery" : "Mark delivered"} <Check className="size-3.5" /></Button></div> : null}
            </motion.article>;
          })}
        </div>
      </main>
    </div>
  );
}

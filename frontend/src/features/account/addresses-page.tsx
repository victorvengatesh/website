"use client";

import { FormEvent, useState } from "react";
import { Home, LocateFixed, MapPin, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store/shop-store";

type Address = { id: string; label: string; line: string; city: string; pincode: string };

export function AddressesPage() {
  const notify = useShopStore((state) => state.notify);
  const [addresses, setAddresses] = useState<Address[]>([{ id: "home", label: "Home", line: "12, Sample Street, Your Area", city: "Karur", pincode: "639001" }]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "Home", line: "", city: "", pincode: "" });

  function add(event: FormEvent) {
    event.preventDefault();
    if (!form.line.trim() || !form.city.trim() || !form.pincode.trim()) return;
    setAddresses((current) => [...current, { ...form, id: `${Date.now()}` }]);
    setForm({ label: "Home", line: "", city: "", pincode: "" });
    setOpen(false);
    notify({ title: "Address saved", description: "It will be ready for your next checkout." });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Delivery details</p><h1 className="section-title mt-3">Saved addresses.</h1><p className="mt-3 text-sm text-muted">Keep local checkout quick and accurate.</p></div><Button onClick={() => setOpen(true)}><Plus className="size-4" /> Add address</Button></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">{addresses.map((address, index) => <motion.article layout key={address.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} className="rounded-[1.7rem] border border-line bg-surface p-5 shadow-soft"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-brand/[.10] text-brand">{index === 0 ? <Home className="size-5" /> : <MapPin className="size-5" />}</span><button type="button" onClick={() => setAddresses((current) => current.filter((item) => item.id !== address.id))} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/[.20]" aria-label={`Delete ${address.label} address`}><Trash2 className="size-4" /></button></div><p className="mt-5 text-sm font-extrabold text-ink">{address.label}{index === 0 && <span className="ml-2 rounded-full bg-success/[.10] px-2 py-1 text-[0.56rem] uppercase tracking-[0.08em] text-success">Default</span>}</p><p className="mt-2 text-xs leading-5 text-muted">{address.line}<br />{address.city} · {address.pincode}</p><button type="button" className="mt-4 text-xs font-extrabold text-brand">Edit address</button></motion.article>)}</AnimatePresence>
      </div>

      <AnimatePresence>{open && <><motion.button type="button" aria-label="Close address form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] bg-ink/[.50] backdrop-blur-sm" /><motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 350, damping: 34 }} className="fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto bg-surface p-6 shadow-lift"><div className="flex items-center justify-between"><div><p className="eyebrow">New delivery point</p><h2 className="mt-2 font-display text-2xl font-extrabold text-ink">Add an address.</h2></div><button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line text-muted" aria-label="Close"><X className="size-5" /></button></div><form onSubmit={add} className="mt-8 space-y-4"><label className="block"><span className="field-label">Label</span><input value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} className="field" /></label><label className="block"><span className="field-label">Full address</span><textarea value={form.line} onChange={(event) => setForm((current) => ({ ...current, line: event.target.value }))} rows={3} className="field h-auto py-3" required /></label><label className="block"><span className="field-label">City</span><input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className="field" required /></label><label className="block"><span className="field-label">Pincode</span><input value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} className="field" required /></label><button type="button" className="flex items-center gap-2 text-xs font-bold text-brand"><LocateFixed className="size-4" /> Capture current location at checkout</button><Button type="submit" className="w-full">Save address</Button></form></motion.aside></>}</AnimatePresence>
    </div>
  );
}

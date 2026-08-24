"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store/shop-store";

export function ProfilePage() {
  const user = useShopStore((state) => state.user);
  const signIn = useShopStore((state) => state.signIn);
  const notify = useShopStore((state) => state.notify);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [offers, setOffers] = useState(true);

  useEffect(() => {
    queueMicrotask(() => setForm({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" }));
  }, [user]);

  function save(event: FormEvent) {
    event.preventDefault();
    if (!form.name || !form.email) return;
    signIn(form);
    notify({ title: "Profile updated", description: "Your demo preferences are saved locally." });
  }

  return (
    <div>
      <p className="eyebrow">Account settings</p><h1 className="section-title mt-3">Profile & preferences.</h1><p className="mt-3 text-sm text-muted">Ready for a secure user profile API when authentication is connected.</p>
      <form onSubmit={save} className="mt-8 rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-extrabold text-ink">Personal information</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block"><span className="field-label">Full name</span><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="field" placeholder="Your name" /></label><label className="block"><span className="field-label">Email</span><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="field" placeholder="you@example.com" /></label><label className="block sm:col-span-2"><span className="field-label">Phone</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="field" placeholder="+91 98765 43210" /></label></div>
        <div className="mt-7 flex justify-end"><Button type="submit">Save changes</Button></div>
      </form>
      <div className="mt-5 rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-brand/[.10] text-brand"><Bell className="size-5" /></span><div><h2 className="font-display text-lg font-extrabold text-ink">Fresh batch notes</h2><p className="mt-0.5 text-xs text-muted">Occasional product drops, offers and gifting reminders.</p></div><label className="relative ml-auto inline-flex h-6 w-11 items-center"><input type="checkbox" checked={offers} onChange={(event) => setOffers(event.target.checked)} className="peer sr-only" /><span className="absolute inset-0 rounded-full bg-line transition peer-checked:bg-brand" /><span className="relative ml-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" /></label></div></div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-success/8 p-5 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" /><span><strong className="text-ink">Privacy by design.</strong> Profile details currently remain in this browser only. A production auth integration should store them server-side with access controls and encrypted transport.</span></div>
    </div>
  );
}

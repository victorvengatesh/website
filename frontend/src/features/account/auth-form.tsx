"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { useShopStore } from "@/store/shop-store";

export function AuthForm({ mode }: { mode: "sign-in" | "register" }) {
  const router = useRouter();
  const signIn = useShopStore((state) => state.signIn);
  const notify = useShopStore((state) => state.notify);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const register = mode === "register";

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (register && form.name.trim().length < 2) return setError("Please enter your full name.");
    if (!form.email.includes("@")) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Use at least 6 characters for the demo password.");
    signIn({ name: register ? form.name.trim() : form.email.split("@")[0].replace(/[._-]/g, " "), email: form.email.trim(), phone: form.phone.trim() || undefined });
    notify({ title: register ? "Demo account created" : "Signed in to preview", description: "Connect an auth provider before production." });
    router.push("/account");
  }

  return (
    <div className="page-shell section-space pt-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.4rem] border border-line bg-surface shadow-lift lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative hidden min-h-[42rem] overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-20 size-80 rounded-full border-[55px] border-brand/[.25]" />
          <div className="absolute -bottom-36 -left-20 size-80 rounded-full bg-brand/[.30] blur-3xl" />
          <div className="relative"><Logo inverse /></div>
          <div className="relative"><p className="eyebrow text-accent">Your shelf, remembered</p><h1 className="mt-4 font-display text-5xl font-extrabold leading-[.98] tracking-[-0.055em]">Good snacks. Less admin.</h1><p className="mt-5 text-sm leading-7 text-white/[.58]">Save addresses, keep a wishlist and see every order’s journey from kitchen to doorstep.</p></div>
          <div className="relative flex items-center gap-2 text-xs text-white/[.55]"><ShieldCheck className="size-4 text-success" /> Authentication UI ready for provider integration</div>
        </div>
        <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} className="p-6 sm:p-10 lg:p-14">
          <div className="lg:hidden"><Logo /></div>
          <div className="mt-8 lg:mt-0">
            <p className="eyebrow">{register ? "Join the neighbourhood" : "Welcome back"}</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{register ? "Create your account." : "Sign in to your shelf."}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">UI preview only. Connect Auth.js, Clerk, Supabase Auth or your FastAPI JWT endpoints before launch.</p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {register && <label className="block"><span className="field-label">Full name</span><div className="relative"><UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" /><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ananya Raman" className="field pl-11" /></div></label>}
            <label className="block"><span className="field-label">Email</span><div className="relative"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" /><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" className="field pl-11" /></div></label>
            {register && <label className="block"><span className="field-label">Phone (optional)</span><input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+91 98765 43210" className="field" /></label>}
            <label className="block"><span className="field-label">Password</span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" /><input type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="At least 6 characters" className="field pl-11 pr-11" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
            {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/[.20] dark:text-red-300">{error}</motion.p>}
            <Button type="submit" className="w-full">{register ? "Create demo account" : "Continue to account"} <ArrowRight className="size-4" /></Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted">{register ? "Already have an account?" : "New to Namma Bites?"} <Link href={register ? "/account/sign-in" : "/account/register"} className="font-extrabold text-brand">{register ? "Sign in" : "Create an account"}</Link></p>
        </motion.div>
      </div>
    </div>
  );
}

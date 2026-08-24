"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSuccess(true);
  }

  return (
    <section className="page-shell section-space">
      <div className="relative isolate overflow-hidden rounded-[2.4rem] bg-brand-gradient px-5 py-12 text-white shadow-glow sm:px-10 sm:py-16 lg:px-16">
        <div className="absolute -right-24 -top-28 size-80 rounded-full border-[50px] border-white/[.10]" />
        <div className="absolute -bottom-28 left-[40%] size-64 rounded-full bg-accent/[.20] blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.67rem] font-extrabold uppercase tracking-[0.18em] text-accent">
              <Sparkles className="size-3.5" /> The fresh list
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-[1.03] tracking-[-0.045em] sm:text-5xl">First dibs on every fresh batch.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/[.70]">New recipes, limited hampers and members-only prices. One useful note a week—never inbox clutter.</p>
          </div>
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-white/[.20] bg-white/[.13] p-7 text-center backdrop-blur-xl">
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.08 }} className="mx-auto grid size-14 place-items-center rounded-full bg-white text-brand">
                  <Check className="size-6" />
                </motion.div>
                <p className="mt-4 font-display text-xl font-extrabold">You’re on the fresh list.</p>
                <p className="mt-1 text-xs text-white/[.68]">Watch your inbox for a warm welcome.</p>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, scale: 0.96 }} onSubmit={submit} className="rounded-3xl border border-white/[.20] bg-white/[.13] p-3 backdrop-blur-xl sm:flex">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <div className="relative min-w-0 flex-1">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/[.60]" />
                  <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-[3.25rem] w-full rounded-2xl bg-white/[.12] pl-11 pr-4 text-sm text-white outline-none ring-1 ring-white/[.14] transition placeholder:text-white/[.48] focus:bg-white/[.18] focus:ring-white/[.40]" />
                </div>
                <button type="submit" className="mt-2 flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-extrabold text-brand transition hover:-translate-y-0.5 hover:shadow-xl sm:ml-2 sm:mt-0 sm:w-auto">
                  Join the list <ArrowRight className="size-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

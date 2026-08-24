"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  Clock3,
  CreditCard,
  LocateFixed,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/orders";
import { cartItemCount, cartSubtotal, useShopStore } from "@/store/shop-store";

const steps = ["Address", "Delivery", "Payment", "Review"] as const;
type Step = (typeof steps)[number];
type DeliveryOption = "standard" | "priority" | "scheduled";
type PaymentMethod = "card" | "upi" | "cod";

type CheckoutData = {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  delivery: DeliveryOption;
  payment: PaymentMethod;
  note: string;
};

const addressSchema = z.object({
  recipient_name: z.string().trim().min(2, "Enter the recipient’s full name."),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, "Enter a valid phone number."),
  address_line: z.string().trim().min(8, "Add the house number, street and area."),
  city: z.string().trim().min(2, "Enter your city."),
  pincode: z.string().trim().regex(/^[0-9]{4,10}$/, "Enter a valid pincode."),
  latitude: z.number({ message: "Capture your precise delivery location." }),
  longitude: z.number({ message: "Capture your precise delivery location." }),
});

const deliveryOptions: Array<{ id: DeliveryOption; icon: typeof Truck; title: string; eta: string; copy: string; price: number }> = [
  { id: "standard", icon: Truck, title: "Fresh route", eta: "45–60 min", copy: "Grouped with the next neighbourhood run.", price: 0 },
  { id: "priority", icon: Sparkles, title: "Priority route", eta: "25–35 min", copy: "Prepared and dispatched in the next slot.", price: 49 },
  { id: "scheduled", icon: Clock3, title: "Schedule later", eta: "Choose after order", copy: "The store confirms your preferred window.", price: 0 },
];

const paymentOptions: Array<{ id: PaymentMethod; icon: typeof CreditCard; title: string; copy: string }> = [
  { id: "card", icon: CreditCard, title: "Credit or debit card", copy: "Stripe-ready secure card flow" },
  { id: "upi", icon: Smartphone, title: "UPI", copy: "Connect your preferred payment provider" },
  { id: "cod", icon: Banknote, title: "Pay on delivery", copy: "Available after store confirmation" },
];

export function CheckoutFlow() {
  const router = useRouter();
  const cart = useShopStore((state) => state.cart);
  const clearCart = useShopStore((state) => state.clearCart);
  const notify = useShopStore((state) => state.notify);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<Step>("Address");
  const [data, setData] = useState<CheckoutData>({
    recipient_name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    latitude: null,
    longitude: null,
    delivery: "standard",
    payment: "card",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationStatus, setLocationStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    void Promise.resolve(useShopStore.persist.rehydrate()).then(() => setReady(true));
  }, []);

  const subtotal = cartSubtotal(cart);
  const deliveryFee = deliveryOptions.find((option) => option.id === data.delivery)?.price ?? 0;
  const total = subtotal + deliveryFee;
  const stepIndex = steps.indexOf(step);

  const orderPreview = useMemo(
    () => ({
      id: "NB-PREVIEW",
      createdAt: "",
      status: "pending_confirmation",
      recipient: data.recipient_name,
      total,
      itemCount: cartItemCount(cart),
      items: cart.map((line) => ({ name: line.product.name, quantity: line.quantity, image: line.product.image })),
    }),
    [cart, data.recipient_name, total],
  );

  function update<K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function captureLocation() {
    setLocationStatus("Locating you securely…");
    if (!navigator.geolocation) {
      setErrors((current) => ({ ...current, location: "Location is not supported in this browser." }));
      setLocationStatus("");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData((current) => ({ ...current, latitude: position.coords.latitude, longitude: position.coords.longitude }));
        setErrors((current) => ({ ...current, location: "", latitude: "", longitude: "" }));
        setLocationStatus(`Location captured · accuracy ${Math.round(position.coords.accuracy)} m`);
      },
      (error) => {
        setLocationStatus("");
        setErrors((current) => ({ ...current, location: error.code === 1 ? "Location access was denied. Enable it and try again." : "We could not capture your location. Please retry." }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function validateAddress() {
    const parsed = addressSchema.safeParse(data);
    if (parsed.success) return true;
    const nextErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = String(issue.path[0]);
      nextErrors[key] = issue.message;
    });
    if (nextErrors.latitude || nextErrors.longitude) nextErrors.location = "Capture your precise delivery location so the shop can confirm distance and ETA.";
    setErrors(nextErrors);
    return false;
  }

  function next(event?: FormEvent) {
    event?.preventDefault();
    if (step === "Address" && !validateAddress()) return;
    const nextStep = steps[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  }

  async function placeOrder() {
    if (data.latitude === null || data.longitude === null) {
      setStep("Address");
      validateAddress();
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      let orderId = `NB-${Date.now().toString().slice(-8)}`;
      const demoMode = process.env.NEXT_PUBLIC_DEMO_CHECKOUT !== "false";
      if (!demoMode) {
        const order = await orderService.create({
          recipient_name: data.recipient_name,
          phone: data.phone,
          address_line: data.address_line,
          city: data.city,
          pincode: data.pincode,
          latitude: data.latitude,
          longitude: data.longitude,
          items: cart.map((line) => ({ sku: line.product.sku, quantity: line.quantity })),
        });
        orderId = order.id;
      }

      const storedOrder = { ...orderPreview, id: orderId, createdAt: new Date().toISOString(), delivery: data.delivery, payment: data.payment };
      const existing = JSON.parse(localStorage.getItem("namma-bites-orders") ?? "[]") as unknown[];
      localStorage.setItem("namma-bites-orders", JSON.stringify([storedOrder, ...existing].slice(0, 12)));
      localStorage.setItem("latest-order-id", orderId);
      clearCart();
      notify({ title: "Order placed successfully", description: "The store will confirm your ETA shortly." });
      router.push(`/checkout/success?order=${encodeURIComponent(orderId)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="page-shell grid min-h-[60vh] place-items-center text-sm text-muted">Preparing your secure checkout…</div>;
  if (!cart.length) {
    return <div className="page-shell grid min-h-[60vh] place-items-center py-20 text-center"><div><PackageCheck className="mx-auto size-14 text-brand" /><h1 className="mt-5 font-display text-3xl font-extrabold text-ink">Your cart is empty.</h1><p className="mt-2 text-sm text-muted">Add something delicious before opening checkout.</p><Button onClick={() => router.push("/products")} className="mt-5">Browse products</Button></div></div>;
  }

  return (
    <div className="page-shell section-space pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-5">
          <div><p className="eyebrow">Secure checkout</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Almost snack time.</h1></div>
          <div className="hidden items-center gap-2 text-[0.64rem] font-bold text-muted sm:flex"><ShieldCheck className="size-4 text-success" /> Encrypted checkout structure</div>
        </div>

        <ol className="mt-8 grid grid-cols-4 gap-1 rounded-2xl border border-line bg-surface p-2 shadow-soft" aria-label="Checkout progress">
          {steps.map((label, index) => {
            const complete = index < stepIndex;
            const active = index === stepIndex;
            return (
              <li key={label} className="relative">
                <button type="button" disabled={index > stepIndex} onClick={() => index <= stepIndex && setStep(label)} className={cn("flex w-full items-center justify-center gap-2 rounded-xl px-2 py-3 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-muted transition sm:text-xs", active && "bg-brand text-white", complete && "text-success hover:bg-success/8")} aria-current={active ? "step" : undefined}>
                  <span className={cn("grid size-5 place-items-center rounded-full border text-[0.58rem]", active && "border-white/[.30]", complete && "border-success bg-success text-white")}>
                    {complete ? <Check className="size-3" /> : index + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
                {step === "Address" && (
                  <form onSubmit={next} noValidate>
                    <h2 className="font-display text-2xl font-extrabold text-ink">Where should the fresh batch go?</h2>
                    <p className="mt-2 text-sm text-muted">Your precise point helps the shop confirm distance and a realistic ETA.</p>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      {[
                        ["recipient_name", "Full name", "Ananya Raman", "text"],
                        ["phone", "Phone number", "+91 98765 43210", "tel"],
                      ].map(([key, label, placeholder, type]) => (
                        <label key={key} className="block"><span className="field-label">{label}</span><input type={type} value={String(data[key as keyof CheckoutData] ?? "")} onChange={(event) => update(key as "recipient_name" | "phone", event.target.value)} placeholder={placeholder} className={cn("field", errors[key] && "border-red-500 ring-4 ring-red-500/8")} />{errors[key] && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 block text-[0.65rem] font-semibold text-red-600">{errors[key]}</motion.span>}</label>
                      ))}
                      <label className="block sm:col-span-2"><span className="field-label">Address</span><textarea value={data.address_line} onChange={(event) => update("address_line", event.target.value)} placeholder="House / flat, street, area and landmark" rows={3} className={cn("field h-auto resize-none py-3", errors.address_line && "border-red-500 ring-4 ring-red-500/8")} />{errors.address_line && <span className="mt-1.5 block text-[0.65rem] font-semibold text-red-600">{errors.address_line}</span>}</label>
                      {[["city", "City", "Karur"], ["pincode", "Pincode", "639001"]].map(([key, label, placeholder]) => <label key={key} className="block"><span className="field-label">{label}</span><input value={String(data[key as keyof CheckoutData] ?? "")} onChange={(event) => update(key as "city" | "pincode", event.target.value)} placeholder={placeholder} inputMode={key === "pincode" ? "numeric" : undefined} className={cn("field", errors[key] && "border-red-500 ring-4 ring-red-500/8")} />{errors[key] && <span className="mt-1.5 block text-[0.65rem] font-semibold text-red-600">{errors[key]}</span>}</label>)}
                    </div>
                    <div className={cn("mt-6 rounded-2xl border p-4", data.latitude !== null ? "border-success/[.30] bg-success/6" : errors.location ? "border-red-400 bg-red-50 dark:bg-red-950/[.15]" : "border-line bg-canvas")}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/[.10] text-brand"><MapPin className="size-5" /></span><span><strong className="block text-sm text-ink">Precise delivery point</strong><span className="mt-0.5 block text-xs leading-5 text-muted">Used only to calculate the delivery radius and ETA.</span></span></div>
                        <Button variant={data.latitude !== null ? "secondary" : "primary"} size="sm" onClick={captureLocation}><LocateFixed className="size-4" /> {data.latitude !== null ? "Refresh location" : "Use my location"}</Button>
                      </div>
                      {locationStatus && <p className="mt-3 text-xs font-bold text-success">✓ {locationStatus}</p>}
                      {errors.location && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs font-bold text-red-600">{errors.location}</motion.p>}
                    </div>
                    <div className="mt-7 flex justify-end"><Button type="submit">Continue to delivery <ArrowRight className="size-4" /></Button></div>
                  </form>
                )}

                {step === "Delivery" && (
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-ink">Choose your delivery rhythm.</h2><p className="mt-2 text-sm text-muted">The final ETA is confirmed when the store accepts the order.</p>
                    <div className="mt-7 space-y-3">{deliveryOptions.map(({ id, icon: Icon, title, eta, copy, price }) => <button key={id} type="button" onClick={() => update("delivery", id)} className={cn("grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl border p-4 text-left transition", data.delivery === id ? "border-brand bg-brand/6 shadow-soft" : "border-line hover:border-brand/[.35]")}><span className={cn("grid size-11 place-items-center rounded-xl", data.delivery === id ? "bg-brand text-white" : "bg-canvas text-muted")}><Icon className="size-5" /></span><span><strong className="block text-sm text-ink">{title} · {eta}</strong><span className="mt-0.5 block text-xs text-muted">{copy}</span></span><strong className="text-sm text-ink">{price ? formatCurrency(price) : "Free"}</strong></button>)}</div>
                    <div className="mt-7 flex justify-between"><Button variant="ghost" onClick={() => setStep("Address")}><ArrowLeft className="size-4" /> Back</Button><Button onClick={() => setStep("Payment")}>Continue to payment <ArrowRight className="size-4" /></Button></div>
                  </div>
                )}

                {step === "Payment" && (
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-ink">How would you like to pay?</h2><p className="mt-2 text-sm text-muted">Payment screens are presentation-ready; connect server-side provider keys before accepting real payments.</p>
                    <div className="mt-7 space-y-3">{paymentOptions.map(({ id, icon: Icon, title, copy }) => <button key={id} type="button" onClick={() => update("payment", id)} className={cn("grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl border p-4 text-left transition", data.payment === id ? "border-brand bg-brand/6 shadow-soft" : "border-line hover:border-brand/[.35]")}><span className={cn("grid size-11 place-items-center rounded-xl", data.payment === id ? "bg-brand text-white" : "bg-canvas text-muted")}><Icon className="size-5" /></span><span><strong className="block text-sm text-ink">{title}</strong><span className="mt-0.5 block text-xs text-muted">{copy}</span></span><span className={cn("grid size-5 place-items-center rounded-full border", data.payment === id ? "border-brand bg-brand text-white" : "border-line")}><Check className="size-3" /></span></button>)}</div>
                    {data.payment === "card" && <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-canvas p-4 opacity-[.70]"><label className="col-span-2"><span className="field-label">Card number · demo</span><input disabled value="4242 4242 4242 4242" className="field" /></label><label><span className="field-label">Expiry</span><input disabled value="12 / 30" className="field" /></label><label><span className="field-label">CVC</span><input disabled value="123" className="field" /></label></div>}
                    <div className="mt-7 flex justify-between"><Button variant="ghost" onClick={() => setStep("Delivery")}><ArrowLeft className="size-4" /> Back</Button><Button onClick={() => setStep("Review")}>Review order <ArrowRight className="size-4" /></Button></div>
                  </div>
                )}

                {step === "Review" && (
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-ink">One last look.</h2><p className="mt-2 text-sm text-muted">Confirm your details. The store will then review availability and delivery distance.</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-canvas p-5"><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-brand">Deliver to</p><p className="mt-3 text-sm font-extrabold text-ink">{data.recipient_name}</p><p className="mt-1 text-xs leading-5 text-muted">{data.address_line}<br />{data.city} · {data.pincode}<br />{data.phone}</p><button type="button" onClick={() => setStep("Address")} className="mt-3 text-xs font-bold text-brand">Edit address</button></div>
                      <div className="rounded-2xl bg-canvas p-5"><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-brand">Delivery & payment</p><p className="mt-3 text-sm font-extrabold capitalize text-ink">{data.delivery} delivery</p><p className="mt-1 text-xs capitalize text-muted">{data.payment === "cod" ? "Pay on delivery" : `${data.payment} · integration-ready`}</p><button type="button" onClick={() => setStep("Payment")} className="mt-3 text-xs font-bold text-brand">Edit options</button></div>
                    </div>
                    <label className="mt-4 block"><span className="field-label">A note for the store (optional)</span><textarea value={data.note} onChange={(event) => update("note", event.target.value)} rows={3} placeholder="Gift message, landmark or delivery note" className="field h-auto resize-none py-3" /></label>
                    {submitError && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/[.20] dark:text-red-300">{submitError}</motion.p>}
                    <div className="mt-7 flex justify-between"><Button variant="ghost" onClick={() => setStep("Payment")}><ArrowLeft className="size-4" /> Back</Button><Button disabled={submitting} onClick={placeOrder}>{submitting ? "Placing order…" : `Place order · ${formatCurrency(total)}`} <ShieldCheck className="size-4" /></Button></div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="self-start rounded-[2rem] border border-line bg-surface p-5 shadow-soft lg:sticky lg:top-36">
            <div className="flex items-center justify-between"><h2 className="font-display text-lg font-extrabold text-ink">Your box</h2><span className="text-xs font-bold text-muted">{cartItemCount(cart)} items</span></div>
            <div className="scrollbar-none mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">{cart.map((line) => <div key={`${line.product.id}-${line.variant}`} className="flex gap-3"><span className="relative size-14 shrink-0 overflow-hidden rounded-xl"><Image src={line.product.image} alt="" fill sizes="56px" className="object-cover" /><span className="absolute right-0 top-0 grid size-5 place-items-center rounded-bl-lg bg-ink text-[0.58rem] font-bold text-white">{line.quantity}</span></span><span className="min-w-0 flex-1"><span className="line-clamp-2 block text-xs font-bold leading-4 text-ink">{line.product.name}</span><span className="mt-1 block text-[0.63rem] text-muted">{formatCurrency(line.product.price * line.quantity)}</span></span></div>)}</div>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs"><div className="flex justify-between text-muted"><dt>Subtotal</dt><dd className="font-bold text-ink">{formatCurrency(subtotal)}</dd></div><div className="flex justify-between text-muted"><dt>Delivery</dt><dd className="font-bold text-ink">{deliveryFee ? formatCurrency(deliveryFee) : "Free"}</dd></div><div className="flex items-end justify-between border-t border-line pt-3"><dt className="font-extrabold text-ink">Total</dt><dd className="font-display text-xl font-extrabold text-ink">{formatCurrency(total)}</dd></div></dl>
          </aside>
        </div>
      </div>
    </div>
  );
}

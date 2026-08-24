"use client";

import { Check, ChefHat, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const stages = [
  { id: "pending_confirmation", label: "Ordered", icon: ShoppingBag },
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "out_for_delivery", label: "On the way", icon: Truck },
  { id: "delivered", label: "Delivered", icon: PackageCheck },
];

export function OrderTimeline({ status }: { status: string }) {
  const activeIndex = Math.max(0, stages.findIndex((stage) => stage.id === status));
  const progress = (activeIndex / (stages.length - 1)) * 100;

  return (
    <div className="relative mt-6">
      <div className="absolute left-[10%] right-[10%] top-4 h-1 rounded-full bg-line" />
      <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 0.8}%` }} transition={{ duration: 0.75 }} className="absolute left-[10%] top-4 h-1 rounded-full bg-brand" />
      <ol className="relative grid grid-cols-5 gap-1">
        {stages.map(({ id, label, icon: Icon }, index) => {
          const complete = index <= activeIndex;
          return <li key={id} className="text-center"><motion.span initial={{ scale: 0.7 }} animate={{ scale: complete ? 1 : 0.84 }} transition={{ delay: index * 0.06 }} className={cn("mx-auto grid size-9 place-items-center rounded-full border-4 border-surface bg-line text-muted", complete && "bg-brand text-white")}><Icon className="size-3.5" /></motion.span><span className={cn("mt-2 block text-[0.52rem] font-bold text-muted sm:text-[0.61rem]", complete && "text-ink")}>{label}</span></li>;
        })}
      </ol>
    </div>
  );
}

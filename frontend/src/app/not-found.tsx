import Link from "next/link";
import { Compass } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return <div className="page-shell grid min-h-[65vh] place-items-center py-20 text-center"><div><div className="mx-auto grid size-20 place-items-center rounded-full bg-brand/[.10] text-brand"><Compass className="size-8" /></div><p className="eyebrow mt-6">404 · Wrong aisle</p><h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink">This page isn’t in the pantry.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Let’s get you back to something fresh.</p><Link href="/" className={buttonStyles({ className: "mt-6" })}>Return home</Link></div></div>;
}

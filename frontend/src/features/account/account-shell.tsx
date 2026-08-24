"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { useShopStore } from "@/store/shop-store";

const navigation = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: Settings },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useShopStore((state) => state.user);
  const signOut = useShopStore((state) => state.signOut);
  const notify = useShopStore((state) => state.notify);

  if (pathname === "/account/sign-in" || pathname === "/account/register") {
    return <>{children}</>;
  }

  return (
    <div className="page-shell section-space pt-9">
      <div className="grid gap-7 lg:grid-cols-[15rem_1fr] xl:gap-10">
        <aside className="self-start overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft lg:sticky lg:top-36">
          <div className="border-b border-line bg-ink p-5 text-canvas">
            <div className="grid size-11 place-items-center rounded-2xl bg-brand text-white"><UserRound className="size-5" /></div>
            <p className="mt-4 font-display text-lg font-extrabold text-white">{user?.name ?? "Hello, snack lover"}</p>
            <p className="mt-1 truncate text-[0.66rem] text-canvas/[.55]">{user?.email ?? "Sign in to sync your shelf"}</p>
          </div>
          <nav className="scrollbar-none flex gap-1 overflow-x-auto p-2 lg:block" aria-label="Account navigation">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-muted transition hover:bg-brand/5 hover:text-brand", active && "bg-brand/8 text-brand")}><Icon className="size-4" />{label}</Link>;
            })}
            {user && <button type="button" onClick={() => { signOut(); notify({ title: "Signed out", tone: "info" }); }} className="flex w-full shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-muted transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/[.20]"><LogOut className="size-4" />Sign out</button>}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

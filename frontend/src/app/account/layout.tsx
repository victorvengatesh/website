import type { Metadata } from "next";

import { AccountShell } from "@/features/account/account-shell";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage Namma Bites orders, wishlist, addresses and profile settings.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}

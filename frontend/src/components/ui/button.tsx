import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export const buttonStyles = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) =>
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[.50] active:scale-[0.97]",
    {
      "bg-brand text-white shadow-[0_12px_30px_rgba(233,83,34,.24)] hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-glow":
        variant === "primary",
      "border border-line bg-surface text-ink shadow-soft hover:-translate-y-0.5 hover:border-brand/[.40] hover:text-brand":
        variant === "secondary",
      "text-ink hover:bg-ink/5 hover:text-brand dark:hover:bg-white/[.10]":
        variant === "ghost",
      "bg-ink text-canvas shadow-soft hover:-translate-y-0.5 hover:bg-brand":
        variant === "dark",
      "h-9 px-3 text-xs": size === "sm",
      "h-11 px-5 text-sm": size === "md",
      "h-[3.25rem] px-7 text-sm": size === "lg",
      "size-11 p-0": size === "icon",
    },
    className,
  );

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

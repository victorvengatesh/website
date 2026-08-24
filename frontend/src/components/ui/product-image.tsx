import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  accent,
  priority = false,
  sizes = "(max-width: 768px) 80vw, 25vw",
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  accent: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "group/image relative isolate overflow-hidden bg-[#f6ead9]",
        className,
      )}
      style={{ "--product-accent": accent } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,.72),transparent_32%),linear-gradient(145deg,color-mix(in_srgb,var(--product-accent)_16%,#fff7e8),#f8eddf)]" />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "relative z-10 object-cover transition duration-700 ease-out group-hover/image:scale-[1.045]",
          imageClassName,
        )}
      />
      <div className="absolute inset-x-[12%] bottom-[4%] h-[12%] rounded-full bg-black/[.20] blur-2xl" />
    </div>
  );
}

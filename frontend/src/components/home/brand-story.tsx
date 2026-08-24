"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, Leaf, PackageCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    number: "01",
    icon: Leaf,
    title: "Ingredients we can name.",
    copy: "Real butter, pure ghee, local grains and whole spices. Nothing is hidden behind clever labels.",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Small batches, every day.",
    copy: "We cook for freshness rather than shelf life, with careful temperature control and a human eye on every batch.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Packed for the journey.",
    copy: "Sealed at peak crunch, cushioned responsibly and sent with a clear local delivery window.",
  },
];

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.to(media, {
        yPercent: 10,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 20%",
          scrub: 0.7,
        },
      });

      gsap.fromTo(
        ".story-step",
        { opacity: 0.32, x: 24 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".story-steps",
            start: "top 72%",
            end: "bottom 72%",
            scrub: 0.5,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-space overflow-hidden">
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div ref={mediaRef} className="relative min-h-[32rem] overflow-hidden rounded-[2.25rem] bg-ink shadow-lift lg:min-h-[43rem]">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/categories/savoury.svg" className="absolute inset-0 size-full object-cover opacity-[.82]">
            <source src="/videos/hero-snacks.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/[.78] via-black/8 to-black/[.12]" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.18em] text-accent">Inside the kitchen</p>
            <p className="mt-3 max-w-lg font-display text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">Made close enough to arrive with the crunch intact.</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">From our kitchen to your table</p>
          <h2 className="section-title mt-4">The shortest distance between heritage and now.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">
            Familiar recipes deserve modern care. We preserve the soul of the snack while improving how it is sourced, cooked, packed and delivered.
          </p>
          <div className="story-steps mt-9 space-y-3">
            {steps.map(({ number, icon: Icon, title, copy }) => (
              <article key={number} className="story-step group grid grid-cols-[3.25rem_1fr] gap-4 rounded-2xl border border-line bg-surface/[.72] p-4 shadow-soft backdrop-blur transition hover:border-brand/[.30] sm:grid-cols-[4rem_1fr] sm:p-5">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/[.10] text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base font-extrabold text-ink sm:text-lg">{title}</h3>
                    <span className="text-[0.6rem] font-extrabold tracking-[0.15em] text-brand">{number}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-muted sm:text-sm sm:leading-6">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Leaf,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { ProductShelf } from "@/components/commerce/product-shelf";
import { BrandStory } from "@/components/home/brand-story";
import { CategoryCard } from "@/components/home/category-card";
import { DealsSection } from "@/components/home/deals-section";
import { HeroVisual } from "@/components/home/hero-visual";
import { Newsletter } from "@/components/home/newsletter";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { categories, products } from "@/data/products";

const faqs = [
  ["How fresh are the snacks?", "Most savouries and bakery items are cooked in small batches every morning. Each pack carries a packed-on label so freshness is easy to verify."],
  ["Where do you deliver?", "The current service is hyperlocal. Enter your location at checkout and the store confirms availability, distance and a realistic ETA before dispatch."],
  ["Can I customise a gift box?", "Yes. Select a gifting product, add your note at checkout, and contact the gift concierge for bulk or branded orders."],
  ["Are dietary details reliable?", "Every product page lists its main ingredients and dietary notes. For allergies, please contact us before ordering because the kitchen handles nuts, dairy and gluten."],
];

export default function HomePage() {
  const featured = products.filter((product) => product.featured);
  const deals = products.filter((product) => product.deal);
  const bestSellers = products.filter((product) => product.bestSeller);

  return (
    <>
      <section className="page-shell py-7 sm:py-10 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-12 xl:gap-20">
          <div className="relative z-10">
            <Reveal>
              <p className="eyebrow"><Sparkles className="size-3.5" /> Tradition, freshly imagined</p>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.25rem,7.2vw,7rem)] font-extrabold leading-[0.87] tracking-[-0.068em] text-ink">
                Crunch into <span className="relative inline-block text-brand">home.<svg className="absolute -bottom-2 left-0 h-3 w-full text-accent" viewBox="0 0 260 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14C70 4 162 2 257 10" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/></svg></span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Small-batch South Indian snacks, honest ingredients and thoughtful gift boxes—packed fresh and delivered around your neighbourhood.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className={buttonStyles({ size: "lg", className: "group" })}>
                  Open the pantry <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </Link>
                <Link href="/products?category=gifting" className={buttonStyles({ variant: "secondary", size: "lg" })}>
                  Curated gift boxes
                </Link>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-3 border-y border-line py-5">
                {[
                  ["30+", "fresh choices"],
                  ["4.8/5", "happy crunchers"],
                  ["45 min", "local target"],
                ].map(([value, label], index) => (
                  <div key={label} className={index ? "border-l border-line pl-4 sm:pl-6" : ""}>
                    <strong className="block font-display text-lg font-extrabold text-ink sm:text-2xl">{value}</strong>
                    <span className="mt-0.5 block text-[0.59rem] font-bold uppercase tracking-[0.09em] text-muted sm:text-[0.65rem]">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-surface/[.68] py-5 backdrop-blur">
        <div className="page-shell grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            [Leaf, "Made in small batches", "Freshness over shelf life"],
            [Bike, "Hyperlocal delivery", "Shorter routes, honest ETAs"],
            [ShieldCheck, "Secure checkout", "Payment-ready architecture"],
            [CheckCircle2, "Thoughtful ingredients", "Clearly listed on every item"],
          ].map(([Icon, title, copy]) => (
            <div key={String(title)} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/9 text-brand"><Icon className="size-4" /></span>
              <span><strong className="block text-xs font-extrabold text-ink">{String(title)}</strong><span className="mt-0.5 hidden text-[0.64rem] text-muted sm:block">{String(copy)}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell section-space">
        <Reveal className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Shop by mood</p>
            <h2 className="section-title mt-3">Every kind of craving.</h2>
          </div>
          <Link href="/products" className="hidden items-center gap-2 text-xs font-extrabold text-brand hover:gap-3 sm:flex">Explore all <ArrowRight className="size-4" /></Link>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category, index) => <CategoryCard key={category.slug} category={category} index={index} />)}
        </div>
      </section>

      <DealsSection products={deals} />

      <ProductShelf
        eyebrow="Chosen again and again"
        title="The neighbourhood favourites."
        description="The shelves customers return to: dependable crunch, balanced spice and recipes that travel beautifully."
        products={bestSellers}
        href="/products?sort=best-sellers"
      />

      <BrandStory />

      <section className="page-shell section-space">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <Reveal className="relative overflow-hidden rounded-[2.2rem] bg-[#154e53] p-7 text-white shadow-lift sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-20 size-72 rounded-full border-[45px] border-white/8" />
            <p className="eyebrow text-accent"><Star className="size-3.5 fill-current" /> Loved locally</p>
            <blockquote className="relative mt-7 max-w-3xl font-display text-2xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl">
              “It tastes like the snack tin at home—only the packaging is beautiful enough to gift.”
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-accent font-display font-extrabold text-ink">AR</span>
              <span><strong className="block text-sm">Ananya R.</strong><span className="text-xs text-white/[.58]">Verified local customer</span></span>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-between rounded-[2.2rem] border border-line bg-surface p-7 shadow-soft sm:p-9">
            <div>
              <Clock3 className="size-7 text-brand" />
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-ink">Fresh today. At your door today.</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Share your precise delivery point at checkout. The shop confirms distance and sends a realistic ETA before preparing your order.</p>
            </div>
            <Link href="/track" className="mt-8 flex items-center justify-between rounded-2xl bg-canvas p-4 text-xs font-extrabold text-ink transition hover:bg-brand hover:text-white">
              Track an existing order <ChevronRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ProductShelf
        eyebrow="A little more you"
        title="Recommended for your snack shelf."
        description="A balanced edit spanning savoury classics, modern millet bites and one sweet finish."
        products={featured.slice().reverse()}
      />

      <section id="faq" className="page-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Good to know</p>
            <h2 className="section-title mt-3">Questions, answered plainly.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">Need something specific? The gift concierge and store team are one message away.</p>
          </Reveal>
          <Reveal className="divide-y divide-line border-y border-line">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-base font-extrabold text-ink marker:hidden sm:text-lg">
                  {question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-brand transition group-open:rotate-90 group-open:bg-brand group-open:text-white"><ChevronRight className="size-4" /></span>
                </summary>
                <p className="max-w-2xl pr-10 pt-3 text-sm leading-6 text-muted">{answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { newLaunches } from "@/data/products";

export function NewLaunches() {
  const items = newLaunches();
  return (
    <section className="bg-paper py-6 md:py-10 lg:py-14">
      <div className="site-wrap">
        <Reveal>
        <h2 className="mb-7 md:mb-10 text-center font-display text-xl sm:text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          New Launches
        </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

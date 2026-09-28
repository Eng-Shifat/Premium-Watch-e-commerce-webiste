import { ProductCard } from "@/components/product/product-card";
import { newLaunches } from "@/data/products";

export function NewLaunches() {
  const items = newLaunches();
  return (
    <section className="bg-paper py-10 md:py-16 lg:py-20">
      <div className="site-wrap">
        <h2 className="mb-7 md:mb-10 text-center font-display text-xl sm:text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          New Launches
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

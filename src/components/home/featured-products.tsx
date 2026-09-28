import { ProductCard } from "@/components/product/product-card";
import { featuredProducts } from "@/data/products";

export function FeaturedProducts() {
  const items = featuredProducts();
  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="site-wrap">
        <h2 className="mb-10 text-center font-display text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

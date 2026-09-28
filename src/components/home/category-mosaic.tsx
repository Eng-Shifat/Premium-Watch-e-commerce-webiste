import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function CategoryMosaic() {
  return (
    <section className="bg-paper py-10 md:py-16 lg:py-20">
      <div className="site-wrap">
        <Reveal>
        <h2 className="text-center font-display text-xl sm:text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          View Our Range Of Categories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[12px] sm:text-[13px] leading-relaxed text-ash">
          Explore our curated watch categories, from classic designs to modern marvels.
          Find the perfect timepiece to match your style, occasion, or lifestyle.
        </p>
        </Reveal>
        {/* Mobile: 2 col grid, Desktop: mosaic */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-3 lg:h-[520px] lg:grid-cols-[1.2fr_0.95fr_1.2fr] lg:grid-rows-2">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.slug}
              variant="scale"
              delay={i * 90}
              className={cn((i === 0 || i === 3) && "lg:row-span-2")}
            >
              <Link
                to="/shop"
                className={cn(
                  "group relative block h-full min-h-[160px] overflow-hidden rounded-xl sm:min-h-[200px]",
                  (i === 0 || i === 3) && "lg:min-h-0",
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 font-display text-[13px] text-white sm:bottom-4 sm:left-4 md:text-xl">
                  {cat.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

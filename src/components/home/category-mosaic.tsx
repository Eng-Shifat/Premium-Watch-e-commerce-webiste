import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function CategoryMosaic() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="site-wrap">
        <h2 className="text-center font-display text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          View Our Range Of Categories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[13px] leading-relaxed text-ash">
          Explore our curated watch categories, from classic designs to modern marvels.
          Find the perfect timepiece to match your style, occasion, or lifestyle.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:h-[520px] lg:grid-cols-[1.2fr_0.95fr_1.2fr] lg:grid-rows-2">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              to="/shop"
              className={
                "group relative min-h-[220px] overflow-hidden rounded-xl " +
                (i === 0 ? "lg:row-span-2 lg:min-h-0 " : "") +
                (i === 3 ? "lg:row-span-2 lg:min-h-0 " : "")
              }
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-lg text-white md:text-xl">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

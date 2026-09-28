import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Desktop layout: [ tall | stacked | tall ] — every tile is placed explicitly so
// grid auto-placement can never push a tile into the wrong cell.
const desktopSlots = [
  "lg:col-start-1 lg:row-start-1 lg:row-span-2", // Women's  (left, tall)
  "lg:col-start-2 lg:row-start-1", //                Steel    (middle, top)
  "lg:col-start-2 lg:row-start-2", //                Leather  (middle, bottom)
  "lg:col-start-3 lg:row-start-1 lg:row-span-2", // Men's    (right, tall)
];

export function CategoryMosaic() {
  return (
    <section className="bg-paper py-6 md:py-10 lg:py-14">
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
        <div className="mt-8 grid grid-cols-2 gap-3 lg:h-[560px] lg:gap-6 lg:grid-cols-[1.2fr_0.95fr_1.2fr] lg:grid-rows-2">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.slug}
              variant="scale"
              delay={i * 90}
              className={desktopSlots[i]}
            >
              <Link
                to="/shop"
                className={cn(
                  "group relative block h-full min-h-[200px] overflow-hidden rounded-xl sm:min-h-[240px] lg:min-h-0",
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
                {/* the category name is already printed on the photo itself, so no text overlay here */}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

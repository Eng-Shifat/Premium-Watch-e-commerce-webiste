import { Link } from "@tanstack/react-router";

const tiles = [
  {
    name: "Women's Watches",
    image: "/images/cat-women.jpg",
    to: "/shop" as const,
    search: { gender: "women" as const },
    area: "women",
  },
  {
    name: "Steel Bracelet Watches",
    image: "/images/cat-steel.jpg",
    to: "/shop" as const,
    search: { strap: "steel" as const },
    area: "steel",
  },
  {
    name: "Leather Watches",
    image: "/images/cat-leather.jpg",
    to: "/shop" as const,
    search: { strap: "leather" as const },
    area: "leather",
  },
  {
    name: "Men's Watches",
    image: "/images/cat-men.jpg",
    to: "/shop" as const,
    search: { gender: "men" as const },
    area: "men",
  },
];

export function CategoryMosaic() {
  return (
    <section className="bg-void pb-8">
      <div className="site-wrap">
        <h2 className="text-center font-display text-2xl font-medium tracking-wide text-mist md:text-[28px]">
          View Our Range Of Categories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[13px] leading-relaxed text-ash">
          Explore our curated watch categories, from classic designs to modern marvels.
          Find the perfect timepiece to match your style, occasion, or lifestyle.
        </p>
        <div
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:h-[520px] lg:grid-cols-[1.2fr_0.95fr_1.2fr] lg:grid-rows-2"
        >
          {tiles.map((tile, i) => (
            <Link
              key={tile.name}
              to={tile.to}
              search={tile.search}
              className={
                "group relative min-h-[220px] overflow-hidden rounded-xl " +
                (i === 0 ? "lg:row-span-2 lg:min-h-0 " : "") +
                (i === 3 ? "lg:row-span-2 lg:min-h-0 " : "")
              }
            >
              <img
                src={tile.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-linear-to-t from-void/70 via-void/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-lg text-paper md:text-xl">
                {tile.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { looks } from "@/data/products";

export function HandPicked() {
  return (
    <section className="bg-paper py-10 pb-16 md:pb-20">
      <div className="site-wrap">
        <h2 className="text-center font-display text-xl sm:text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          Hand Picked
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[12px] sm:text-[13px] leading-relaxed text-ash">
          Discover our hand-picked collection, featuring watches chosen for their quality,
          style, and timeless appeal.
        </p>
        {/* Mobile: single column, sm+: 3 col */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {looks.map((look) => (
            <Link
              key={look.src}
              to="/product/$slug"
              params={{ slug: look.href.replace("/product/", "") }}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
            >
              <img
                src={look.src}
                alt={look.alt}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

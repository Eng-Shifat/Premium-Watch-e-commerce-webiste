import { Link } from "@tanstack/react-router";
import { looks } from "@/data/products";
import { Reveal } from "@/components/motion/reveal";

export function HandPicked() {
  return (
    <section className="bg-paper py-8 pb-10 sm:py-10 sm:pb-16 md:pb-20">
      <div className="site-wrap">
        <Reveal>
        <h2 className="text-center font-display text-xl sm:text-2xl font-medium tracking-wide text-ink md:text-[28px]">
          Hand Picked
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[12px] sm:text-[13px] leading-relaxed text-ash">
          Discover our hand-picked collection, featuring watches chosen for their quality,
          style, and timeless appeal.
        </p>
        </Reveal>
        {/* Mobile: swipe left-to-right carousel (edge to edge), sm+: 3 col grid */}
        <Reveal delay={120}>
        <div
          className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-8 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {looks.map((look) => (
            <Link
              key={look.src}
              to="/product/$slug"
              params={{ slug: look.href.replace("/product/", "") }}
              className="group relative block aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-xl sm:w-auto sm:shrink"
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
        </Reveal>
      </div>
    </section>
  );
}

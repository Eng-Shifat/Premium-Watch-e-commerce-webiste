import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-hero text-ink">
      <div className="grid md:grid-cols-2 min-h-[480px] md:min-h-[640px]">
        {/* Left: text content */}
        <div className="flex items-center">
          <div className="stagger-in w-full px-8 py-16 md:py-24 md:px-16 lg:pl-[max(4rem,calc((100vw-1180px)/2+4rem))] lg:pr-12">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-rose uppercase mb-5">
              Watch Store
            </p>
            <h1 className="font-display text-[52px] leading-[1.08] font-medium tracking-tight text-ink sm:text-[60px] lg:text-[72px]">
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-6 max-w-[360px] text-[13px] leading-relaxed text-ash">
              The best in class elegant watches from the luxury brand Swiss Eagle high-quality
              watches into which a lot of care has gone in.
            </p>
            <Link
              to="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "mt-10 rounded-none px-8 h-12 text-[11px] tracking-[0.2em]"
              )}
            >
              See More
            </Link>
          </div>
        </div>

        {/* Right: full watch image */}
        <div className="relative min-h-[340px] md:min-h-[640px]">
          <img
            src="/images/hero-watch.jpg"
            alt="Black mesh dress watch resting on pale stone"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

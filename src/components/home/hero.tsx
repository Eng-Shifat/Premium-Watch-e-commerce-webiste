import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-hero text-ink">
      <div className="grid md:grid-cols-2 min-h-[480px] md:min-h-[600px]">

        {/* Left: text */}
        <div className="flex items-center">
          <div className="stagger-in w-full px-10 py-16 md:py-20 md:px-14 lg:px-20">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase mb-4">
              Watch Store
            </p>
            <h1 className="font-display text-[44px] leading-[1.1] font-medium tracking-tight text-ink sm:text-[52px] lg:text-[60px]">
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-5 max-w-[340px] text-[13px] leading-relaxed text-ash">
              The best in class elegant watches from the luxury brand Swiss Eagle high-quality
              watches into which a lot of care has gone in.
            </p>
            <Link
              to="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "mt-8 rounded-none px-7 h-11 text-[11px] tracking-[0.18em] border-ink text-ink hover:bg-ink hover:text-paper"
              )}
            >
              See More
            </Link>
          </div>
        </div>

        {/* Right: hero image fills the column */}
        <div className="relative min-h-[300px] md:min-h-[600px]">
          <img
            src="/images/hero/hero1.png"
            alt="Black mesh dress watch resting on pale stone"
            className="absolute inset-0 h-full w-full object-cover object-right"
            fetchPriority="high"
          />
        </div>

      </div>
    </section>
  );
}

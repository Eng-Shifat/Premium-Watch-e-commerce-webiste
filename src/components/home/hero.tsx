import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-hero text-ink overflow-hidden">
      <div className="relative min-h-[480px] md:min-h-[600px]">

        {/* Full-width background image — watch sits on right naturally */}
        <img
          src="/images/hero/hero1.png"
          alt="Black mesh dress watch resting on pale stone"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          fetchPriority="high"
        />

        {/* Left half grey overlay so text stays readable */}
        <div className="absolute inset-0 bg-hero [mask-image:linear-gradient(to_right,#000_55%,transparent_80%)]" />

        {/* Text — vertically centered, left aligned */}
        <div className="relative z-10 flex items-center min-h-[480px] md:min-h-[600px]">
          <div className="stagger-in w-full max-w-[50%] px-10 py-16 md:py-20 md:px-14 lg:px-20">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase mb-4">
              Watch Store
            </p>
            <h1 className="font-display text-[44px] leading-[1.1] font-medium tracking-tight text-ink sm:text-[52px] lg:text-[60px]">
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-5 max-w-[320px] text-[13px] leading-relaxed text-ash">
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

      </div>
    </section>
  );
}

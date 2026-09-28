import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[480px] md:min-h-[640px] text-white overflow-hidden">
      {/* Background image — full width */}
      <img
        src="/images/hero/hero1.png"
        alt="Hero watch background"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text content — on top of image */}
      <div className="relative z-10 flex items-center min-h-[480px] md:min-h-[640px]">
        <div className="stagger-in px-8 py-16 md:py-24 md:px-16 lg:pl-[max(4rem,calc((100vw-1180px)/2+4rem))] lg:pr-12 max-w-[620px]">
          <p className="text-[11px] font-semibold tracking-[0.35em] text-rose uppercase mb-5">
            Watch Store
          </p>
          <h1 className="font-display text-[52px] leading-[1.08] font-medium tracking-tight sm:text-[60px] lg:text-[72px]">
            The Watch<br />
            Everyone<br />
            Desires!
          </h1>
          <p className="mt-6 max-w-[360px] text-[13px] leading-relaxed text-white/80">
            The best in class elegant watches from the luxury brand Swiss Eagle high-quality
            watches into which a lot of care has gone in.
          </p>
          <Link
            to="/shop"
            className={cn(
              buttonVariants({ variant: "outline", size: "md" }),
              "mt-10 rounded-none px-8 h-12 text-[11px] tracking-[0.2em] border-white text-white hover:bg-white hover:text-ink"
            )}
          >
            See More
          </Link>
        </div>
      </div>
    </section>
  );
}

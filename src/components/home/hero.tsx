import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/hero/hero1.png"
        alt=""
        fetchPriority="high"
        className="hero-zoom absolute inset-0 w-full h-full object-cover object-[62%_center] sm:object-center"
      />
      {/* mobile: soft fade only behind the text (left), watch on the right stays crisp */}
      <div className="absolute inset-0 bg-linear-to-r from-hero/90 from-25% via-hero/45 via-50% to-transparent to-70% sm:hidden" />

      {/* +72px = the transparent header that floats over the hero */}
      <div className="relative z-10 flex items-center min-h-[452px] pt-[72px] sm:min-h-[532px] md:min-h-[632px]">
        <div className="site-wrap w-full">
          <div className="stagger-in max-w-[340px] sm:max-w-[380px] md:max-w-[420px]">
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] text-rose uppercase mb-3 sm:mb-5">
              Watch Store
            </p>
            <h1 className="font-display font-medium tracking-tight text-ink text-[32px] leading-[1.1] sm:text-[44px] md:text-[56px] lg:text-[60px]">
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-4 text-[12px] sm:text-[13px] leading-relaxed text-ash max-w-[190px] min-[420px]:max-w-[240px] sm:max-w-[300px]">
              The best in class elegant watches from the luxury brand Swiss Eagle
              high-quality watches into which a lot of care has gone in.
            </p>
            <Link
              to="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "mt-6 sm:mt-8 rounded-none px-5 sm:px-7 h-10 sm:h-11 text-[10px] sm:text-[11px] tracking-[0.18em] border-ink text-ink hover:bg-ink hover:text-paper"
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

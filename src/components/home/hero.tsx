import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Below lg the photo fills the hero. From lg up it is shown ~14% smaller (zoomed out), sits on the
          right and fades softly into the hero colour on its left edge, so no seam is visible. */}
      <div className="absolute inset-0 flex items-center justify-end">
        <img
          src="/images/hero/hero1.png"
          alt=""
          fetchPriority="high"
          className="hero-zoom h-full w-full object-cover object-[62%_center] sm:object-center lg:h-auto lg:min-h-full lg:w-[86%] lg:max-w-none lg:shrink-0 lg:object-right lg:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_18%)] lg:[mask-image:linear-gradient(to_right,transparent,#000_18%)]"
        />
      </div>
      {/* mobile: soft fade only behind the text (left), watch on the right stays crisp */}
      <div className="absolute inset-0 bg-linear-to-r from-hero/95 from-30% via-hero/50 via-55% to-transparent to-75% sm:hidden" />

      {/* +72px = the transparent header that floats over the hero */}
      <div className="relative z-10 flex items-center min-h-[300px] pb-6 pt-6 sm:min-h-[380px] md:min-h-[480px]">
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

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>

      {/* Background image — full section */}
      <img
        src="/images/hero/hero1.png"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Content — site-wrap aligned, vertically centered */}
      <div className="relative z-10 flex items-center" style={{ minHeight: "560px" }}>
        <div className="site-wrap w-full">
          <div className="stagger-in max-w-[420px]">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase mb-5">
              Watch Store
            </p>
            <h1
              className="font-display font-medium tracking-tight text-ink"
              style={{ fontSize: "clamp(38px, 4vw, 60px)", lineHeight: 1.1 }}
            >
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-5 text-[13px] leading-relaxed text-ash max-w-[300px]">
              The best in class elegant watches from the luxury brand Swiss Eagle
              high-quality watches into which a lot of care has gone in.
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

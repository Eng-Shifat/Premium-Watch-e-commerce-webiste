import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-hero text-ink">
      <div className="grid md:grid-cols-2" style={{ minHeight: "560px" }}>

        {/* Left: text — vertically centered */}
        <div className="flex items-center" style={{ minHeight: "560px" }}>
          <div className="stagger-in px-12 py-16 lg:px-20">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase mb-5">
              Watch Store
            </p>
            <h1
              className="font-display font-medium tracking-tight text-ink"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1 }}
            >
              The Watch<br />
              Everyone<br />
              Desires!
            </h1>
            <p className="mt-5 text-[13px] leading-relaxed text-ash" style={{ maxWidth: "320px" }}>
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

        {/* Right: image — show full watch, don't crop */}
        <div className="relative hidden md:block" style={{ minHeight: "560px" }}>
          <img
            src="/images/hero/hero1.png"
            alt="Black mesh dress watch resting on pale stone"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "20% center" }}
            fetchPriority="high"
          />
        </div>

      </div>
    </section>
  );
}

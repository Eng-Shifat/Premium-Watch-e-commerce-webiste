import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-hero text-ink">
      <div className="grid md:grid-cols-2">
        <div className="flex items-center">
          <div className="stagger-in mx-auto w-full max-w-[560px] px-5 py-12 md:ml-auto md:mr-0 md:px-10 md:py-20 lg:pl-[max(2rem,calc((100vw-1180px)/2))] lg:pr-8">
            <p className="text-[11px] font-medium tracking-[0.28em] text-rose uppercase">
              Watch Store
            </p>
            <h1 className="mt-4 font-display text-[42px] leading-[1.12] font-medium tracking-tight text-ink sm:text-5xl lg:text-[56px]">
              The Watch
              <br />
              Everyone Desires!
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
              The best in class elegant watches from the luxury brand Swiss Eagle high-quality
              watches into which a lot of care has gone in.
            </p>
            <Link
              to="/shop"
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "mt-8")}
            >
              See More
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] md:min-h-[640px]">
          <img
            src="/images/hero-watch.jpg"
            alt="Black mesh dress watch resting on pale stone"
            className="absolute inset-0 h-full w-full object-cover object-[62%_48%] md:object-[58%_42%]"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

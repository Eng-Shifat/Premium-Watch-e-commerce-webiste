import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About Us — UrbanTick" }] }),
});

function AboutPage() {
  return (
    <main className="bg-void">
      <PageIntro kicker="The House" title="About Us" />
      <article className="site-wrap max-w-3xl py-14 text-[15px] leading-relaxed text-mist">
        <p>
          UrbanTick is a watch house built around a single idea: a timepiece should be desired, not
          merely worn. We curate Swiss Eagle movements into cases that sit quietly on the wrist —
          leather, steel, mesh, gold-tone — and we finish them in an atelier that still believes in
          proportion.
        </p>
        <p className="mt-5">
          The collection is small on purpose. Eight pieces, two lines. Studio watches are photographed
          as catalog objects: white field, honest metal. Atelier watches are shot as they live — low
          light, cream dials, the gear train showing through. Both are assembled to the same
          specification.
        </p>
        <p className="mt-5">
          We ship from India, we stand behind a two-year warranty, and we answer the phone. If you
          want the watch everyone desires, it is probably already in the case.
        </p>
        <Link to="/shop" className={buttonVariants({ variant: "line" }) + " mt-10"}>
          View the collection
        </Link>
      </article>
    </main>
  );
}

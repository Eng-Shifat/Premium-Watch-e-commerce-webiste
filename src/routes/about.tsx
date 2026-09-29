import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About Us — UrbanTick" }] }),
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="site-wrap max-w-3xl py-8 pb-24">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ash">The House</p>
        <h1 className="mt-2 text-[22px] font-medium text-ink sm:text-[26px]">About Us</h1>

        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ash">
          <p>
            UrbanTick is a watch house built around a single idea: a timepiece should be desired, not
            merely worn. We curate Swiss Eagle movements into cases that sit quietly on the wrist —
            leather, steel, mesh, gold-tone — and we finish them in an atelier that still believes in
            proportion.
          </p>
          <p>
            The collection is small on purpose. Eight pieces, two lines. Studio watches are photographed
            as catalog objects: white field, honest metal. Atelier watches are shot as they live — low
            light, cream dials, the gear train showing through. Both are assembled to the same
            specification.
          </p>
          <p>
            We ship from India, we stand behind a two-year warranty, and we answer the phone. If you
            want the watch everyone desires, it is probably already in the case.
          </p>
        </div>

        <Link
          to="/shop"
          className="mt-10 inline-block rounded-full bg-ink px-8 py-3 text-[13px] font-semibold tracking-[0.08em] text-paper transition-opacity hover:opacity-80 active:scale-95"
        >
          VIEW THE COLLECTION
        </Link>
      </article>
    </main>
  );
}

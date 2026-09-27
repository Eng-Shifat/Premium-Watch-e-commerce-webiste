import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms of use — UrbanTick" }] }),
});

function TermsPage() {
  return (
    <main className="bg-void">
      <PageIntro kicker="Legal" title="Terms of use" />
      <div className="site-wrap max-w-2xl space-y-5 py-14 text-[15px] leading-relaxed text-mist">
        <p>
          This storefront is a demonstration of the UrbanTick collection. Checkout records an order
          on your device; no payment is processed. Product photographs and copy describe the watches
          as merchandised.
        </p>
        <p>
          Prices are in Indian rupees and include the tax position shown at checkout. Availability
          is not guaranteed. Warranty is two years from the date on the order ticket for movement
          and case, excluding straps and crystal damage from impact.
        </p>
      </div>
    </main>
  );
}

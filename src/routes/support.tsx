import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({ meta: [{ title: "Product Support — UrbanTick" }] }),
});

function SupportPage() {
  return (
    <main className="bg-void">
      <PageIntro kicker="Support" title="Product Support" />
      <div className="site-wrap max-w-2xl space-y-6 py-14 text-[15px] leading-relaxed text-mist">
        <p>
          Water, straps, batteries, and the odd scratch. Write to{" "}
          <a href="mailto:urbantick@gmail.com" className="text-paper">
            urbantick@gmail.com
          </a>{" "}
          with your order id and a photograph of the watch. We answer within one working day.
        </p>
        <p>
          Quartz pieces use Swiss Eagle SE-series movements. A battery change is complimentary for
          the first two years if the watch was purchased from UrbanTick.
        </p>
        <p>
          Need a strap?{" "}
          <Link to="/contact" className="text-paper underline">
            Contact us
          </Link>{" "}
          with the case size printed on the warranty card.
        </p>
      </div>
    </main>
  );
}

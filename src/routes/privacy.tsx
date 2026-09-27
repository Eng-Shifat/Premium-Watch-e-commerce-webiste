import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy Policy — UrbanTick" }] }),
});

function PrivacyPage() {
  return (
    <main className="bg-void">
      <PageIntro kicker="Legal" title="Privacy Policy" />
      <div className="site-wrap max-w-2xl space-y-5 py-14 text-[15px] leading-relaxed text-mist">
        <p>
          UrbanTick stores your bag, wishlist, and orders in the browser on this device. We do not
          operate a user account or a remote customer database for this storefront.
        </p>
        <p>
          If you write to us, we keep the email long enough to answer it. We do not sell addresses.
          Analytics, if any, are first-party and anonymous.
        </p>
        <p>Questions: urbantick@gmail.com.</p>
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/layout/page-intro";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
  head: () => ({ meta: [{ title: "Shipping & Returns — UrbanTick" }] }),
});

function ShippingPage() {
  return (
    <main className="bg-void">
      <PageIntro kicker="Support" title="Shipping & Return Policy" />
      <div className="site-wrap max-w-2xl space-y-6 py-14 text-[15px] leading-relaxed text-mist">
        <p>
          We ship across India. Prepaid orders leave within two working days. COD is available on
          studio pieces under ₹20,000.
        </p>
        <p>
          Unworn watches may be returned within 7 days of delivery, in original packaging, for a
          full refund to the original payment method. Atelier pieces with exhibition casebacks are
          final sale once the seal is broken.
        </p>
        <p>
          International shipping is not offered on this store. For a quote, write to
          urbantick@gmail.com.
        </p>
      </div>
    </main>
  );
}

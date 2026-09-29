import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, Phone, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact Us — UrbanTick" }] }),
});

const INFO: { Icon: LucideIcon; label: string; value: string; href?: string }[] = [
  { Icon: Mail, label: "Email", value: "urbantick@gmail.com", href: "mailto:urbantick@gmail.com" },
  { Icon: Phone, label: "Phone", value: "+91 8888888888", href: "tel:+918888888888" },
  { Icon: Clock, label: "Hours", value: "Monday–Saturday, 10:00–18:00 IST" },
];

const fieldCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[14px] text-ink outline-none transition-all placeholder:text-ash/60 focus:border-ink focus:ring-4 focus:ring-ink/5";
const labelCls = "mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-ash";

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("Message received — we will write back.");
    e.currentTarget.reset();
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="site-wrap py-8 pb-24">
        <h1 className="text-[22px] font-medium text-ink sm:text-[26px]">Contact Us</h1>
        <p className="mt-1 mb-8 text-[14px] text-ash">Email, phone, or the form. We read everything.</p>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Contact details */}
          <div className="space-y-4">
            {INFO.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border border-line p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
                  <Icon className="size-[19px]" strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ash">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block truncate text-[15px] font-medium text-ink hover:opacity-60 transition-opacity">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[15px] font-medium text-ink">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line p-6">
            <div>
              <label htmlFor="c-name" className={labelCls}>Name</label>
              <input id="c-name" name="name" required className={fieldCls} />
            </div>
            <div>
              <label htmlFor="c-email" className={labelCls}>Email</label>
              <input id="c-email" name="email" type="email" required className={fieldCls} />
            </div>
            <div>
              <label htmlFor="c-msg" className={labelCls}>Message</label>
              <textarea id="c-msg" name="message" required rows={6} className={`${fieldCls} resize-y`} />
            </div>
            <button
              type="submit"
              className="rounded-full bg-ink px-8 py-3 text-[13px] font-semibold tracking-[0.08em] text-paper transition-opacity hover:opacity-80 active:scale-95"
            >
              SEND
            </button>
            {sent ? <p className="text-[13px] text-ash">Thank you. We have the note.</p> : null}
          </form>
        </div>
      </div>
    </main>
  );
}

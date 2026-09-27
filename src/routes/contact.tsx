import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact Us — UrbanTick" }] }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("Message received — we will write back.");
    e.currentTarget.reset();
  }

  return (
    <main className="bg-void">
      <PageIntro
        kicker="Contact"
        title="Contact Us"
        lede="Email, phone, or the form. We read everything."
      />
      <div className="site-wrap grid gap-10 py-14 md:grid-cols-2">
        <div className="text-sm text-mist">
          <p>
            Email
            <br />
            <a href="mailto:urbantick@gmail.com" className="text-paper">
              urbantick@gmail.com
            </a>
          </p>
          <p className="mt-6">
            Phone
            <br />
            <a href="tel:+918888888888" className="text-paper">
              +91 8888888888
            </a>
          </p>
          <p className="mt-6">
            Hours
            <br />
            Monday–Saturday, 10:00–18:00 IST
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" name="name" required className="border-line-dark bg-void text-paper" />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              name="email"
              type="email"
              required
              className="border-line-dark bg-void text-paper"
            />
          </div>
          <div>
            <Label htmlFor="c-msg">Message</Label>
            <Textarea
              id="c-msg"
              name="message"
              required
              className="border-line-dark bg-void text-paper"
            />
          </div>
          <Button type="submit" variant="light">
            Send
          </Button>
          {sent ? <p className="text-[13px] text-mist">Thank you. We have the note.</p> : null}
        </form>
      </div>
    </main>
  );
}

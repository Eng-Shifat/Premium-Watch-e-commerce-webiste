import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export const Route = createFileRoute("/complaint")({
  component: ComplaintPage,
  head: () => ({ meta: [{ title: "Complaint Registration — UrbanTick" }] }),
});

function ComplaintPage() {
  const [ref, setRef] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = `C-${Math.floor(10000 + Math.random() * 90000)}`;
    setRef(id);
    toast.success(`Complaint ${id} registered`);
    e.currentTarget.reset();
  }

  return (
    <main className="bg-void">
      <PageIntro
        kicker="Support"
        title="Complaint Registration"
        lede="We log every complaint. You will receive a reference number on this screen."
      />
      <form onSubmit={onSubmit} className="site-wrap max-w-xl space-y-4 py-12 pb-20">
        <div>
          <Label htmlFor="order">Order id (if any)</Label>
          <Input id="order" name="order" className="border-line-dark bg-void text-paper" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="border-line-dark bg-void text-paper"
          />
        </div>
        <div>
          <Label htmlFor="body">What happened</Label>
          <Textarea id="body" name="body" required className="border-line-dark bg-void text-paper" />
        </div>
        <Button type="submit" variant="light">
          Register complaint
        </Button>
        {ref ? <p className="text-sm text-paper">Reference {ref}. Keep this number.</p> : null}
      </form>
    </main>
  );
}

import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { signIn } from "@/lib/auth/client";
import { emailExists, startSignup } from "@/lib/local-auth";
import {
  AuthPage, AuthTitle, BlackButton, GoogleButton, PillInput,
  LINKFONT, MONO, announceOtp, authHead, safeRedirect,
} from "@/components/auth/auth-ui";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safeRedirect(s.redirect) }),
  component: SignupPage,
  head: authHead("Signup"),
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Field = "username" | "email" | "password" | "confirm";

function SignupPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [bad, setBad] = useState<Field | null>(null);
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setBad(null);
  };

  function fail(field: Field, msg: string) {
    setBad(field);
    toast.error(msg);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (form.username.trim().length < 3) return fail("username", "Username must be at least 3 characters.");
    if (!EMAIL_RE.test(form.email.trim())) return fail("email", "Enter a valid email address.");
    if (emailExists(form.email)) return fail("email", "An account with this email already exists.");
    if (form.password.length < 6) return fail("password", "Password must be at least 6 characters.");
    if (form.confirm !== form.password) return fail("confirm", "Passwords do not match.");

    setBusy(true);
    const pending = await startSignup({
      username: form.username,
      email: form.email,
      password: form.password,
      redirect,
    });
    setBusy(false);
    announceOtp(pending.otp, pending.email);
    router.history.push("/verify-otp");
  }

  async function onGoogle() {
    setGBusy(true);
    try {
      await signIn("grok-google", { callbackURL: redirect ?? "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in isn't available right now.");
    } finally {
      setGBusy(false);
    }
  }

  return (
    <AuthPage>
      <form onSubmit={onSubmit} noValidate className="flex flex-col items-center px-5 pb-14 pt-7 sm:px-8">
        <AuthTitle>Signup</AuthTitle>

        <div className="mt-5 w-full sm:mt-6 sm:w-[65%]">
          <PillInput name="username" autoComplete="username" placeholder="Username"
            value={form.username} invalid={bad === "username"} onChange={set("username")} />
          <PillInput type="email" name="email" autoComplete="email" placeholder="Email" className="mt-6 sm:mt-[30px]"
            value={form.email} invalid={bad === "email"} onChange={set("email")} />
          <PillInput type="password" name="password" autoComplete="new-password" placeholder="Password" className="mt-6 sm:mt-[30px]"
            value={form.password} invalid={bad === "password"} onChange={set("password")} />
          <PillInput type="password" name="confirm" autoComplete="new-password" placeholder="Confirm Password" className="mt-4 sm:mt-[18px]"
            value={form.confirm} invalid={bad === "confirm"} onChange={set("confirm")} />

          <div style={LINKFONT} className="mt-4 flex justify-end pr-3 text-[13px] text-black sm:mt-[22px] sm:pr-8 sm:text-[15px]">
            <Link
              to="/login"
              search={{ redirect }}
              className="underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Login
            </Link>
          </div>
        </div>

        <BlackButton type="submit" disabled={busy} className="mt-1 sm:mt-0">
          {busy ? "Please wait…" : "Signup"}
        </BlackButton>

        <p style={MONO} className="mt-7 text-center text-[15px] tracking-[0.06em] text-black sm:text-[17px]">
          Or Signup with
        </p>
        <GoogleButton onClick={onGoogle} busy={gBusy} />
      </form>
    </AuthPage>
  );
}

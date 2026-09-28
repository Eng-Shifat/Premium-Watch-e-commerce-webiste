import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { signIn } from "@/lib/auth/client";
import { loginLocal } from "@/lib/local-auth";
import {
  AuthPage, AuthTitle, BlackButton, GoogleButton, PillInput,
  LINKFONT, MONO, authHead, safeRedirect,
} from "@/components/auth/auth-ui";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safeRedirect(s.redirect) }),
  component: LoginPage,
  head: authHead("Login"),
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bad, setBad] = useState<"email" | "password" | null>(null);
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!EMAIL_RE.test(email.trim())) {
      setBad("email");
      toast.error("Enter a valid email address.");
      return;
    }
    if (!password) {
      setBad("password");
      toast.error("Enter your password.");
      return;
    }
    setBad(null);
    setBusy(true);
    const res = await loginLocal(email, password);
    setBusy(false);
    if (!res.ok) {
      setBad(res.field);
      toast.error(res.error);
      return;
    }
    toast.success("Welcome back!");
    router.history.push(redirect ?? "/");
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
      <form onSubmit={onSubmit} noValidate className="flex flex-col items-center px-5 pb-11 pt-9 sm:px-8 sm:pt-10">
        <AuthTitle>Login</AuthTitle>

        <div className="mt-11 w-full sm:mt-[52px] sm:w-[65%]">
          <PillInput
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            invalid={bad === "email"}
            onChange={(e) => { setEmail(e.target.value); setBad(null); }}
          />
          <PillInput
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            className="mt-9 sm:mt-[54px]"
            value={password}
            invalid={bad === "password"}
            onChange={(e) => { setPassword(e.target.value); setBad(null); }}
          />

          <div style={LINKFONT} className="mt-2 flex items-center justify-between px-0.5 text-[13px] text-black sm:text-[15px]">
            <Link
              to="/signup"
              search={{ redirect }}
              className="underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Signup
            </Link>
            <button
              type="button"
              onClick={() => toast.info("Password reset isn't available yet.")}
              className="underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Forget Password?
            </button>
          </div>
        </div>

        <BlackButton type="submit" disabled={busy} className="mt-9 sm:mt-[49px]">
          {busy ? "Logging in…" : "Login"}
        </BlackButton>

        <p style={MONO} className="mt-7 text-center text-[15px] tracking-[0.06em] text-black sm:text-[17px]">
          Or continue with
        </p>
        <GoogleButton onClick={onGoogle} busy={gBusy} />
      </form>
    </AuthPage>
  );
}

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useHasHydrated } from "@/lib/hydrate";
import {
  OTP_LENGTH, OTP_RESEND_SECONDS, getLocalUser, getPendingSignup, resendOtp, verifyOtp,
} from "@/lib/local-auth";
import {
  AuthPage, AuthTitle, BlackButton, BODY, announceOtp, authHead,
} from "@/components/auth/auth-ui";

export const Route = createFileRoute("/verify-otp")({
  component: VerifyOtpPage,
  head: authHead("Verify OTP"),
});

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function VerifyOtpPage() {
  const hydrated = useHasHydrated();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Need a pending signup to be here — otherwise go back to signup.
  useEffect(() => {
    if (!hydrated) return;
    const p = getPendingSignup();
    if (!p) {
      // Already verified and signed in (the pending signup was consumed) -> just go home.
      if (getLocalUser()) {
        router.history.replace("/");
        return;
      }
      toast.error("Start by creating an account.");
      router.history.replace("/signup");
      return;
    }
    setEmail(p.email);
    setSeconds(Math.max(0, Math.min(OTP_RESEND_SECONDS, OTP_RESEND_SECONDS - Math.floor((Date.now() - p.sentAt) / 1000))));
    refs.current[0]?.focus();
  }, [hydrated, router]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  function setAt(i: number, v: string) {
    setDigits((d) => d.map((x, idx) => (idx === i ? v : x)));
  }

  function onChange(i: number, raw: string) {
    const v = raw.replace(/\D/g, "").slice(-1);
    setAt(i, v);
    if (v && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, "");
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? ""));
    refs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  function oops(msg: string) {
    toast.error(msg);
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const code = digits.join("");
    if (code.length < OTP_LENGTH) return oops(`Enter the ${OTP_LENGTH}-digit OTP.`);
    setBusy(true);
    const res = verifyOtp(code);
    if (res.ok) {
      toast.success("Account verified — you're signed in!");
      router.history.push(res.redirect ?? "/");
      return;
    }
    setBusy(false);
    if (res.reason === "wrong") {
      setDigits(Array(OTP_LENGTH).fill(""));
      refs.current[0]?.focus();
      return oops("Incorrect OTP. Please try again.");
    }
    if (res.reason === "expired") return oops("This OTP has expired. Please resend a new one.");
    if (res.reason === "taken") {
      toast.error("An account with this email already exists.");
      router.history.replace("/login");
      return;
    }
    router.history.replace("/signup");
  }

  function onResend() {
    if (seconds > 0) return;
    const p = resendOtp();
    if (!p) {
      router.history.replace("/signup");
      return;
    }
    setDigits(Array(OTP_LENGTH).fill(""));
    setSeconds(OTP_RESEND_SECONDS);
    refs.current[0]?.focus();
    announceOtp(p.otp, p.email);
  }

  return (
    <AuthPage size="md">
      <form onSubmit={onSubmit} noValidate className="flex flex-col items-center px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-[60px]">
        <AuthTitle>Verify Your OTP</AuthTitle>
        <p className="sr-only" aria-live="polite">A {OTP_LENGTH}-digit code was sent to {email}.</p>

        <div className="mt-10 w-full sm:mt-[48px] sm:w-[72%]">
          <div className="flex items-center justify-center gap-3 rounded-[22px] bg-[#d1d2d4] px-4 py-[48px] sm:gap-[34px] sm:px-8 sm:py-[48px]">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${i + 1}`}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={onPaste}
                onFocus={(e) => e.currentTarget.select()}
                style={BODY}
                className={`ut-otp size-[52px] rounded-[14px] border border-black bg-white text-center text-[24px] font-medium text-black outline-none transition-shadow focus:ring-2 focus:ring-black/70 sm:size-[63px] ${shake ? "ut-shake" : ""}`}
              />
            ))}
          </div>

          <div style={BODY} className="mt-3 flex items-center justify-between px-1 text-[13px] text-black sm:px-[17px] sm:text-[15px]">
            <span>
              Didn’t get the OTP?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={seconds > 0}
                className="font-bold disabled:cursor-not-allowed enabled:hover:underline"
              >
                Resend OTP
              </button>
            </span>
            <span className="font-bold tabular-nums" aria-live="off">{mmss(seconds)}</span>
          </div>
        </div>

        <BlackButton type="submit" disabled={busy} className="mt-4 sm:mt-[14px]">
          Submit
        </BlackButton>
      </form>

      <style>{`
        @keyframes ut-shake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-6px) } 40% { transform: translateX(6px) }
          60% { transform: translateX(-4px) } 80% { transform: translateX(4px) }
        }
        .ut-shake { animation: ut-shake .4s ease-in-out; border-color: #ef4444 }
      `}</style>
    </AuthPage>
  );
}

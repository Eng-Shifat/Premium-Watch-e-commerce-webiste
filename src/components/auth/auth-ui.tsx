import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SHOW_DEMO_OTP } from "@/lib/local-auth";

/* Fonts used by the login / signup / OTP designs (loaded per-route through `head.links`). */
export const AUTH_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Oxygen:wght@300;400;700&family=Space+Mono:wght@400;700&display=swap";

export const authHead = (title: string) => () => ({
  meta: [{ title: `${title} — UrbanTick` }],
  links: [{ rel: "stylesheet", href: AUTH_FONTS_HREF }],
});

export const MONO = { fontFamily: '"DM Mono", ui-monospace, "SFMono-Regular", Menlo, monospace' } as const;
export const LINKFONT = { fontFamily: '"Space Mono", ui-monospace, Menlo, monospace' } as const;
export const BODY = { fontFamily: 'Oxygen, "Outfit", ui-sans-serif, system-ui, sans-serif' } as const;

/** Only allow same-site relative redirects. */
export function safeRedirect(v: unknown): string | undefined {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : undefined;
}

export function announceOtp(otp: string, email: string) {
  if (SHOW_DEMO_OTP) {
    toast.info(`Demo mode — your OTP is ${otp}`, {
      description: `Normally this would be emailed to ${email}.`,
      duration: 20000,
    });
  } else {
    toast.success(`OTP sent to ${email}`);
  }
}

/* ─── Layout ────────────────────────────────────────── */
export function AuthPage({
  children,
  size = "lg",
  className,
}: {
  children: ReactNode;
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <main className="bg-paper">
      <div className="site-wrap flex justify-center py-10 sm:py-14 md:py-16">
        <section
          className={cn(
            "w-full rounded-[32px] border-[4px] border-black bg-white sm:rounded-[44px]",
            size === "lg" ? "max-w-[710px]" : "max-w-[580px]",
            className,
          )}
        >
          {children}
        </section>
      </div>
    </main>
  );
}

export function AuthTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      style={MONO}
      className={cn("text-center text-[24px] font-normal tracking-[0.12em] text-black sm:text-[30px]", className)}
    >
      {children}
    </h1>
  );
}

/* ─── Controls ──────────────────────────────────────── */
export function PillInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      aria-label={props.placeholder}
      aria-invalid={invalid || undefined}
      style={BODY}
      className={cn(
        "h-[52px] w-full rounded-[18px] bg-[#d1d2d4] px-6 text-[15px] tracking-[0.06em] text-black outline-none",
        "placeholder:text-[#1c1c1c] transition-shadow focus:ring-2 focus:ring-black/70 sm:h-[57px] sm:px-[42px] sm:text-[16px]",
        invalid && "ring-2 ring-red-500/80 focus:ring-red-500",
        className,
      )}
      {...props}
    />
  );
}

export function BlackButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={MONO}
      className={cn(
        "flex h-[44px] w-[200px] items-center justify-center rounded-[18px] bg-black text-[19px] font-medium tracking-[0.06em] text-white",
        "transition-all duration-150 hover:opacity-85 active:scale-[0.97] disabled:opacity-60 sm:w-[206px]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function GoogleButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="Continue with Google"
      className="mx-auto mt-2 flex size-9 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
    >
      <GoogleIcon className="size-6" />
    </button>
  );
}

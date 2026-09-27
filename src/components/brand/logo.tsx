import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 tracking-[0.22em] text-[15px] font-medium",
        invert ? "text-paper" : "text-ink",
        className,
      )}
      aria-label="UrbanTick home"
    >
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true" fill="none">
        <circle cx="16" cy="16" r="12.25" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="1.15" fill="currentColor" />
        <path
          d="M16 9.2v7.1l5.1 3.05"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span>URBANTICK</span>
    </Link>
  );
}

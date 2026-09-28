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
        {/* Outer circle */}
        <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        {/* Inner circle */}
        <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.4" />
        {/* Center dot */}
        <circle cx="16" cy="16" r="1.15" fill="currentColor" />
        {/* Minute hand — fast */}
        <line x1="16" y1="16" x2="16" y2="8.2"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            from="0 16 16" to="360 16 16" dur="1.5s" repeatCount="indefinite" />
        </line>
        {/* Hour hand — slower */}
        <line x1="16" y1="16" x2="20.5" y2="19"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            from="0 16 16" to="360 16 16" dur="18s" repeatCount="indefinite" />
        </line>
      </svg>
      <span className="logo-text">URBANTICK</span>
    </Link>
  );
}

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
        {/* Clock face */}
        <circle cx="16" cy="16" r="12.25" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="1.15" fill="currentColor" />

        {/* Minute hand — rotates fast (60s per revolution) */}
        <line
          x1="16" y1="16"
          x2="16" y2="6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ transformOrigin: "16px 16px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="6s"
            repeatCount="indefinite"
          />
        </line>

        {/* Hour hand — rotates slow (12x slower) */}
        <line
          x1="16" y1="16"
          x2="21" y2="19.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ transformOrigin: "16px 16px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="72s"
            repeatCount="indefinite"
          />
        </line>
      </svg>
      <span>URBANTICK</span>
    </Link>
  );
}

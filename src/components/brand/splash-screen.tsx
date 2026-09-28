import { useEffect, useState } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "fadeout" | "done">("visible");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeout"), 2200);
    const t2 = setTimeout(() => setPhase("done"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-paper"
      style={{
        transition: "opacity 400ms cubic-bezier(0.22,1,0.36,1)",
        opacity: phase === "fadeout" ? 0 : 1,
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      {/* Animated logo */}
      <div className="splash-logo flex items-center gap-3 tracking-[0.22em]">
        <svg viewBox="0 0 32 32" className="size-12 text-ink" aria-hidden="true" fill="none">
          <circle cx="16" cy="16" r="12.25" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="1.15" fill="currentColor" />
          {/* Minute hand */}
          <line x1="16" y1="16" x2="16" y2="6.5"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              from="0 16 16" to="360 16 16" dur="6s" repeatCount="indefinite" />
          </line>
          {/* Hour hand */}
          <line x1="16" y1="16" x2="21" y2="19.5"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              from="0 16 16" to="360 16 16" dur="72s" repeatCount="indefinite" />
          </line>
        </svg>
        <span className="text-[22px] font-medium text-ink">URBANTICK</span>
      </div>

      {/* Progress line */}
      <div className="splash-line mt-10 h-px w-28 overflow-hidden rounded-full bg-line">
        <div className="splash-progress h-full bg-ink" />
      </div>
    </div>
  );
}

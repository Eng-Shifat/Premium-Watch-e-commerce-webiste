import { useEffect, useState } from "react";

const LETTERS = "URBANTICK".split("");

export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "fadeout" | "done">("visible");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeout"), 3000);
    const t2 = setTimeout(() => setPhase("done"), 3400);
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
      {/* Logo lockup: icon + (letters / progress line) */}
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 32 32" className="splash-icon size-12 text-ink" aria-hidden="true" fill="none">
          <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="1.15" fill="currentColor" />
          <line x1="16" y1="16" x2="16" y2="8.2"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              from="0 16 16" to="360 16 16" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="16" y1="16" x2="20.5" y2="19"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              from="0 16 16" to="360 16 16" dur="18s" repeatCount="indefinite" />
          </line>
        </svg>

        <div className="flex flex-col">
          {/* Letters appear one by one */}
          <div className="text-[22px] font-medium text-ink" style={{ letterSpacing: 0 }}>
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                className="splash-letter"
                style={{
                  animationDelay: `${300 + i * 110}ms`,
                  marginRight: i === LETTERS.length - 1 ? 0 : "0.22em",
                }}
              >
                {ch}
              </span>
            ))}
          </div>

          {/* Progress line, directly under the text */}
          <div className="splash-line mt-3 h-px w-full overflow-hidden rounded-full bg-line">
            <div className="splash-progress h-full bg-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}

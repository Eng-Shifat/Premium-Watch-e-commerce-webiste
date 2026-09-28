import { useEffect, useState } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "fadeout" | "done">("visible");

  useEffect(() => {
    // After 2s start fading out
    const t1 = setTimeout(() => setPhase("fadeout"), 2000);
    // After fade (400ms) mark done so it unmounts
    const t2 = setTimeout(() => setPhase("done"), 2400);
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
      {/* Logo image with reveal animation */}
      <div className="splash-logo">
        <img
          src="/logo.png"
          alt="UrbanTick"
          className="h-12 w-auto sm:h-14"
          draggable={false}
        />
      </div>

      {/* Thin progress line */}
      <div className="splash-line mt-8 h-px w-24 overflow-hidden rounded-full bg-line">
        <div className="splash-progress h-full bg-ink" />
      </div>
    </div>
  );
}

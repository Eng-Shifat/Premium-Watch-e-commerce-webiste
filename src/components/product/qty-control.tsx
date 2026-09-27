import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyControl({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center rounded-md border border-line text-ink",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex size-11 items-center justify-center"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex size-11 items-center justify-center"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

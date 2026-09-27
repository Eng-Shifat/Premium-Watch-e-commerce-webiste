import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink placeholder:text-ash/80",
        "outline-none focus-visible:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ash/80",
        "outline-none focus-visible:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ash", className)}
      {...props}
    />
  );
}

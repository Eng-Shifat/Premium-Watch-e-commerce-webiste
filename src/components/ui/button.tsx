import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[background-color,color,border-color,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  {
    variants: {
      variant: {
        outline:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        solid: "bg-ink text-paper hover:bg-ink/90",
        light: "bg-paper text-ink hover:bg-soft",
        ghost: "text-current hover:opacity-70",
        line: "border border-paper/30 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-void",
      },
      size: {
        md: "h-11 px-6 text-[11px] uppercase tracking-[0.18em] rounded-md",
        sm: "h-9 px-4 text-[11px] uppercase tracking-[0.16em] rounded-md",
        lg: "h-12 px-8 text-xs uppercase tracking-[0.2em] rounded-md",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { static?: boolean };

export function Button({ className, variant, size, static: isStatic, ...props }: Props) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        isStatic && "active:scale-100",
        className,
      )}
      {...props}
    />
  );
}

export { buttonVariants };

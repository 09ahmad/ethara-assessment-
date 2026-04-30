import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/helpers";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-[var(--color-primary)] text-white hover:opacity-90",
  secondary: "bg-[var(--color-tertiary)] text-[var(--color-primary)] border border-slate-300 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-[var(--color-primary)] hover:bg-slate-100",
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

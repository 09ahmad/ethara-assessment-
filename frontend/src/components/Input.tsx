import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/helpers";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-600">{label}</span> : null}
      <input
        className={cn(
          "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)]",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  hint?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

export function PasswordInput({
  label,
  hint,
  className,
  id,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "min-h-12 w-full rounded-xl border border-border bg-surface-bright py-3 pl-4 pr-12 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:text-sm",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="touch-target absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2.5 text-muted transition-colors hover:text-foreground"
          aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      {hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className, id, ...props }: InputProps) {
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
      <input
        id={inputId}
        className={cn(
          "min-h-12 w-full rounded-xl border border-border bg-surface-bright px-4 py-3 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:text-sm",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: number;
  showBackground?: boolean;
};

/** Inline Top Mela mark — ascending bars + peak (distinct from generic crown/star logos). */
export function BrandLogo({
  className,
  size = 36,
  showBackground = true,
}: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      className={cn("shrink-0", className)}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="brand-bg" x1="16" y1="8" x2="112" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1714" />
          <stop offset="1" stopColor="#0a0908" />
        </linearGradient>
        <linearGradient id="brand-gold" x1="32" y1="88" x2="96" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a67c00" />
          <stop offset="0.5" stopColor="#e4b429" />
          <stop offset="1" stopColor="#f5d76e" />
        </linearGradient>
        <linearGradient id="brand-glow" x1="40" y1="40" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e4b429" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e4b429" stopOpacity="0" />
        </linearGradient>
      </defs>
      {showBackground && (
        <>
          <path
            d="M64 8C92 8 112 28 112 56V88C112 108 96 120 64 120C32 120 16 108 16 88V56C16 28 36 8 64 8Z"
            fill="url(#brand-bg)"
          />
          <path
            d="M64 8C92 8 112 28 112 56V88C112 108 96 120 64 120C32 120 16 108 16 88V56C16 28 36 8 64 8Z"
            stroke="url(#brand-gold)"
            strokeWidth="2.5"
          />
          <ellipse cx="64" cy="52" rx="36" ry="28" fill="url(#brand-glow)" />
        </>
      )}
      <path d="M38 82V58L48 68V82H38Z" fill="url(#brand-gold)" opacity="0.55" />
      <path d="M54 82V44L64 54V82H54Z" fill="url(#brand-gold)" opacity="0.8" />
      <path d="M70 82V32L80 42V82H70Z" fill="url(#brand-gold)" />
      <path d="M64 22L72 34H56L64 22Z" fill="#f5d76e" />
      <path
        d="M34 86H94"
        stroke="#e4b429"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

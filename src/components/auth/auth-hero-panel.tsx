import Image from "next/image";
import { BarChart3 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function AuthHeroPanel() {
  return (
    <div className="relative hidden min-h-dvh flex-1 flex-col overflow-hidden bg-white lg:flex">
      {/* Soft blue accent — keeps white-blue brand without overpowering the art */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-slate-50" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-64 w-64 rounded-full bg-blue-100/40 blur-2xl" />

      <div className="relative z-10 flex items-center gap-2 p-10 xl:p-14">
        <BarChart3 className="h-8 w-8 text-primary" strokeWidth={2.5} />
        <span className="font-display text-2xl font-bold text-foreground">
          {APP_NAME}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-10 xl:px-14">
        <Image
          src="/images/auth-hero.svg"
          alt="Birr Tera platform illustration"
          width={520}
          height={340}
          className="h-auto w-full max-w-lg object-contain"
          priority
        />
        <p className="mt-8 max-w-sm text-center text-sm leading-relaxed text-muted">
          Premium VIP membership & daily earnings in Birr (ETB). Deposit, invest,
          and grow your portfolio on mobile.
        </p>
      </div>
    </div>
  );
}

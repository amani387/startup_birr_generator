import { BarChart3, Shield, Smartphone, TrendingUp } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function AuthHeroPanel() {
  return (
    <div className="auth-hero-panel relative hidden min-h-dvh flex-1 flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8" strokeWidth={2.5} />
          <span className="font-display text-2xl font-bold">{APP_NAME}</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-md space-y-6">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3">
              <Smartphone className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Mobile-first platform</p>
              <p className="font-display text-lg font-bold">Trade & earn anywhere</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <TrendingUp className="h-6 w-6 text-blue-200" />
            <p className="mt-2 text-xs text-blue-100">Daily VIP income</p>
            <p className="font-bold">Up to 1,357 Birr/day</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <Shield className="h-6 w-6 text-blue-200" />
            <p className="mt-2 text-xs text-blue-100">Secure wallet</p>
            <p className="font-bold">Deposits & withdrawals</p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-sm text-blue-100">
        Premium VIP membership & earnings in Birr (ETB)
      </p>

      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-1/4 h-56 w-56 rounded-full bg-blue-300/20 blur-2xl" />
    </div>
  );
}

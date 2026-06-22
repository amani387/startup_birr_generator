import { AuthHeroPanel } from "@/components/auth/auth-hero-panel";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <div className="flex flex-1 flex-col bg-white lg:bg-surface-bright">
        <div className="flex justify-end gap-2 p-4 lg:absolute lg:left-4 lg:right-auto lg:top-4 lg:z-20">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
        </div>
        <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
      <AuthHeroPanel />
    </div>
  );
}

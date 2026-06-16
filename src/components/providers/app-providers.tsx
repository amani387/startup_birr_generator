import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/index";
import { FeedbackProvider } from "@/components/providers/feedback-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  locale: Locale;
  theme: "light" | "dark";
  children: ReactNode;
};

export function AppProviders({ locale, theme, children }: AppProvidersProps) {
  return (
    <ThemeProvider initialTheme={theme}>
      <I18nProvider locale={locale}>
        <FeedbackProvider>{children}</FeedbackProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

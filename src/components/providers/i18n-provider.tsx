"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  createTranslator,
  dictionaries,
  type Dictionary,
  type Locale,
} from "@/lib/i18n/index";
import { setLocale as setLocaleAction } from "@/lib/actions/preferences";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const dict = dictionaries[locale];
  const t = useMemo(() => createTranslator(dict), [dict]);

  const setLocale = useCallback(
    (next: Locale) => {
      startTransition(async () => {
        await setLocaleAction(next);
        router.refresh();
      });
    },
    [router]
  );

  return (
    <I18nContext.Provider value={{ locale, dict, t, setLocale, isPending }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function useTranslation() {
  return useI18n().t;
}

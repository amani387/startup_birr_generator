"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setTheme as setThemeAction } from "@/lib/actions/preferences";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isPending: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.classList.add("transition-theme");
  root.style.colorScheme = theme;
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const router = useRouter();
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [isPending, startTransition] = useTransition();

  // On mount: localStorage wins over server cookie (prevents flash back to dark)
  useEffect(() => {
    const stored = readStoredTheme();
    const resolved = stored ?? initialTheme;
    setThemeState(resolved);
    applyTheme(resolved);
  }, [initialTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* ignore */
      }
      startTransition(async () => {
        await setThemeAction(next);
        router.refresh();
      });
    },
    [router]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isPending }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

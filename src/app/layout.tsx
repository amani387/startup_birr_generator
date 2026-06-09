import { cookies } from "next/headers";
import { Plus_Jakarta_Sans, Noto_Sans_Ethiopic, Syne } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import type { Locale } from "@/lib/i18n/index";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Top Mela — VIP Membership & Earnings",
  description: "Premium VIP membership and earnings platform in Birr",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
    shortcut: "/icon.svg",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Top Mela" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
  ],
};

async function getInitialPreferences() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  const theme = cookieStore.get("theme")?.value;
  return {
    locale: (locale === "en" || locale === "am" || locale === "om"
      ? locale
      : "en") as Locale,
    theme: (theme === "dark" ? "dark" : "light") as "light" | "dark",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, theme } = await getInitialPreferences();

  return (
    <html
      lang={locale}
      className={`${jakarta.variable} ${syne.variable} ${notoEthiopic.variable} h-full ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||document.cookie.match(/theme=(light|dark)/)?.[1]||'light';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <AppProviders locale={locale} theme={theme}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

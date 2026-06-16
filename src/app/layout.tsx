import { cookies } from "next/headers";
import { Inter, Montserrat, Noto_Sans_Ethiopic } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { getAppUrl } from "@/lib/app-url";
import type { Locale } from "@/lib/i18n/index";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: "Birr Tera — VIP Membership & Earnings",
  description: "Premium VIP membership and forex-style earnings platform in Birr",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
    shortcut: "/icon.svg",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Birr Tera" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
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
      className={`${inter.variable} ${montserrat.variable} ${notoEthiopic.variable} h-full ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){var m=document.cookie.match(/theme=(light|dark)/);t=m?m[1]:null}if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t}catch(e){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'}})();`,
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

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { constructMetadata, HeadScripts } from "@/lib/seo";
import { LanguageProvider } from "@/lib/i18n/context";
import { LanguageSuggestionBanner } from "@/components/shared/language-suggestion-banner";
import { GoogleTranslator } from "@/components/shared/google-translator";
import { AnalyticsRouteTracker } from "@/components/analytics/analytics-route-tracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${outfit.variable}`}>
      <head>
        <HeadScripts />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans overflow-x-hidden max-w-full w-full">
        <AnalyticsRouteTracker />
        <LanguageProvider>
          <LanguageSuggestionBanner />
          {children}
          <GoogleTranslator />
        </LanguageProvider>
      </body>
    </html>
  );
}

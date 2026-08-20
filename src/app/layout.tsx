import type { Metadata } from "next";
import { constructMetadata, HeadScripts } from "@/lib/seo";
import { LanguageProvider } from "@/lib/i18n/context";
import { LanguageSuggestionBanner } from "@/components/shared/language-suggestion-banner";
import "./globals.css";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load English (Inter/Outfit) + Regional Indic Fonts (Noto Sans Devanagari, Bengali, Oriya, Gurmukhi) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&family=Noto+Sans+Oriya:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <HeadScripts />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        <LanguageProvider>
          <LanguageSuggestionBanner />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

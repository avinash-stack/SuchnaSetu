"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { useLanguage } from "@/lib/i18n/context";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __suchnaSetuTranslateInitialized?: boolean;
  }
}

/**
 * Production-grade Google Translate Client-Side Integration for SuchnaSetu.
 * Translates the full visible DOM between English and Hindi while suppressing Google's default banner UI.
 */
export function GoogleTranslator() {
  const { language } = useLanguage();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Define global initialization callback
    window.googleTranslateElementInit = function () {
      if (window.google?.translate?.TranslateElement && !window.__suchnaSetuTranslateInitialized) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
          window.__suchnaSetuTranslateInitialized = true;
          initializedRef.current = true;

          // Apply current language if Hindi
          const targetLang = document.documentElement.getAttribute("data-lang") || "en";
          if (targetLang === "hi") {
            setTimeout(() => {
              applyGoogleLanguage("hi");
            }, 300);
          }
        } catch (e) {
          console.warn("[Google Translate Initialization Warning]:", e);
        }
      }
    };

    // If script is already loaded and window.google is ready
    if (window.google?.translate?.TranslateElement && !window.__suchnaSetuTranslateInitialized) {
      window.googleTranslateElementInit();
    }
  }, []);

  // React to language context changes
  useEffect(() => {
    applyGoogleLanguage(language);
  }, [language]);

  return (
    <>
      {/* Hidden container for Google Translate Element */}
      <div
        id="google_translate_element"
        className="notranslate"
        aria-hidden="true"
        style={{ display: "none", position: "absolute", top: "-9999px", left: "-9999px" }}
      />
      <Script
        id="google-translate-api"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Programmatically triggers Google Translate between English and Hindi
 */
export function applyGoogleLanguage(lang: "en" | "hi") {
  if (typeof window === "undefined") return;

  const targetCookie = lang === "hi" ? "/en/hi" : "/en/en";
  const hostname = window.location.hostname;

  // 1. Set Google Translate cookies across all relevant host domains
  try {
    document.cookie = `googtrans=${targetCookie}; path=/;`;
    if (hostname) {
      document.cookie = `googtrans=${targetCookie}; path=/; domain=.${hostname};`;
      document.cookie = `googtrans=${targetCookie}; path=/; domain=${hostname};`;
    }
  } catch {}

  // 2. Dispatch change event to Google Translate combo box if present
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    const desiredVal = lang === "hi" ? "hi" : "en";
    if (combo.value !== desiredVal) {
      combo.value = desiredVal;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  // 3. Clean up when switching back to English
  if (lang === "en") {
    try {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (hostname) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      }
    } catch {}

    // Check if iframe restoration button exists or reload is needed
    const isTranslated = document.documentElement.classList.contains("translated-ltr") || 
                         document.body.classList.contains("translated-ltr");
    if (isTranslated) {
      const banner = document.querySelector<HTMLIFrameElement>(".goog-te-banner-frame");
      if (banner && banner.contentDocument) {
        const closeBtn = banner.contentDocument.querySelector<HTMLElement>(".goog-close-link, .goog-te-banner-frame-close");
        if (closeBtn) {
          closeBtn.click();
          return;
        }
      }
      // If combo event didn't trigger full DOM restore after 400ms, reload cleanly
      setTimeout(() => {
        if (document.documentElement.classList.contains("translated-ltr") || document.body.classList.contains("translated-ltr")) {
          window.location.reload();
        }
      }, 400);
    }
  }
}

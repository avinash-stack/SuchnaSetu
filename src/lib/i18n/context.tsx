"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_DISMISSED_SUGGESTION_KEY,
  getSuggestedLanguageForState,
} from "./config";
import { getTranslation, TranslationKey } from "./translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode, userExplicit?: boolean) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  suggestedLanguage: LanguageCode | null;
  suggestedStateCode: string | null;
  dismissSuggestion: () => void;
  acceptSuggestion: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  // 1. Check URL param ?lang=
  try {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang") as LanguageCode | null;
    if (langParam && SUPPORTED_LANGUAGES[langParam]) {
      return langParam;
    }
  } catch {}

  // 2. Check localStorage
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
    if (saved && SUPPORTED_LANGUAGES[saved]) {
      return saved;
    }
  } catch {}

  // 3. Check Cookie
  try {
    const match = document.cookie.match(new RegExp(`(^| )${LANGUAGE_COOKIE_NAME}=([^;]+)`));
    if (match && match[2] && SUPPORTED_LANGUAGES[match[2] as LanguageCode]) {
      return match[2] as LanguageCode;
    }
  } catch {}

  return DEFAULT_LANGUAGE;
}

function StateSuggestionListener({
  language,
  onSuggest,
}: {
  language: LanguageCode;
  onSuggest: (lang: LanguageCode | null, stateCode: string | null) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const stateParam = searchParams?.get("state");
    if (!stateParam) {
      onSuggest(null, null);
      return;
    }

    const targetLang = getSuggestedLanguageForState(stateParam);
    if (!targetLang || targetLang === language) {
      onSuggest(null, null);
      return;
    }

    try {
      const dismissed = sessionStorage.getItem(`${LANGUAGE_DISMISSED_SUGGESTION_KEY}_${stateParam.toUpperCase()}`);
      if (dismissed) {
        onSuggest(null, null);
        return;
      }
    } catch {}

    onSuggest(targetLang, stateParam.toUpperCase());
  }, [searchParams, language, onSuggest]);

  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [suggestedLanguage, setSuggestedLanguage] = useState<LanguageCode | null>(null);
  const [suggestedStateCode, setSuggestedStateCode] = useState<string | null>(null);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    applyLanguageToDOM(initialLang);
  }, []);

  const applyLanguageToDOM = (lang: LanguageCode) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.setAttribute("data-lang", lang);
    }
  };

  const setLanguage = useCallback((newLang: LanguageCode, userExplicit = true) => {
    if (!SUPPORTED_LANGUAGES[newLang]) return;

    setLanguageState(newLang);
    applyLanguageToDOM(newLang);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        document.cookie = `${LANGUAGE_COOKIE_NAME}=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch {}
    }

    setSuggestedLanguage(null);
    setSuggestedStateCode(null);
  }, []);

  const onSuggest = useCallback((lang: LanguageCode | null, stateCode: string | null) => {
    setSuggestedLanguage(lang);
    setSuggestedStateCode(stateCode);
  }, []);

  const dismissSuggestion = useCallback(() => {
    if (suggestedStateCode) {
      try {
        sessionStorage.setItem(`${LANGUAGE_DISMISSED_SUGGESTION_KEY}_${suggestedStateCode}`, "true");
      } catch {}
    }
    setSuggestedLanguage(null);
    setSuggestedStateCode(null);
  }, [suggestedStateCode]);

  const acceptSuggestion = useCallback(() => {
    if (suggestedLanguage) {
      setLanguage(suggestedLanguage, true);
    }
  }, [suggestedLanguage, setLanguage]);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return getTranslation(language, key, params);
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      suggestedLanguage,
      suggestedStateCode,
      dismissSuggestion,
      acceptSuggestion,
    }),
    [language, setLanguage, t, suggestedLanguage, suggestedStateCode, dismissSuggestion, acceptSuggestion]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <Suspense fallback={null}>
        <StateSuggestionListener language={language} onSuggest={onSuggest} />
      </Suspense>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key: TranslationKey, params?: Record<string, string | number>) => getTranslation(DEFAULT_LANGUAGE, key, params),
      suggestedLanguage: null,
      suggestedStateCode: null,
      dismissSuggestion: () => {},
      acceptSuggestion: () => {},
    };
  }
  return context;
}

import { LanguageCode } from "../config";
import { en, TranslationKey } from "./en";
import { hi } from "./hi";
import { bn } from "./bn";
import { or } from "./or";
import { as } from "./as";
import { pa } from "./pa";

export { type TranslationKey } from "./en";

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en,
  hi,
  bn,
  or,
  as,
  pa,
};

/**
 * Returns translated string for the given key and language.
 * Falls back to English if the key is missing in the target language.
 * Supports string interpolation: t('key', { name: 'value' }) replaces '{name}' with 'value'.
 */
export function getTranslation(
  lang: LanguageCode,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = translations[lang] || translations.en;
  let text = dict[key] || translations.en[key] || (key as string);

  if (params) {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    }
  }

  return text;
}

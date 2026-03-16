import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/common.json";
import es from "../public/locales/es/common.json";

/**
 * i18n configuration with bundled translations.
 * Translations are statically imported instead of fetched at runtime,
 * making this setup compatible with both SPA and SSR modes.
 * Language detection falls back to English; when SSR is enabled,
 * detection can move to the Accept-Language header in a root loader.
 */
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: ["en", "es"],
  ns: ["common"],
  defaultNS: "common",
  resources: {
    en: { common: en },
    es: { common: es },
  },
  lng:
    typeof window !== "undefined" && navigator?.language?.startsWith("es")
      ? "es"
      : "en",
  react: {
    useSuspense: true,
  },
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  debug: false,
});

export default i18n;

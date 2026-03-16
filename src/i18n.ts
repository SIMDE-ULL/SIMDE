import i18n, { type i18n as I18nInstance, createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/common.json";
import es from "../public/locales/es/common.json";

const i18nConfig = {
  fallbackLng: "en",
  supportedLngs: ["en", "es"],
  ns: ["common"],
  defaultNS: "common",
  resources: {
    en: { common: en },
    es: { common: es },
  },
  react: {
    useSuspense: true,
  },
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  debug: false,
} as const;

/** Creates an i18n instance for a given locale. Used per-request on the server. */
export function createI18nInstance(lng: string): I18nInstance {
  const instance = createInstance();
  instance.use(initReactI18next).init({ ...i18nConfig, lng });
  return instance;
}

/** Client-side singleton i18n instance. Detects language from the browser. */
const clientLng =
  typeof window !== "undefined" && navigator?.language?.startsWith("es")
    ? "es"
    : "en";

i18n.use(initReactI18next).init({ ...i18nConfig, lng: clientLng });

export default i18n;

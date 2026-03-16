import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import es from "./locales/es/common.json";

const clientLng =
  typeof window !== "undefined" && navigator?.language?.startsWith("es")
    ? "es"
    : "en";

i18n.use(initReactI18next).init({
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
  lng: clientLng,
  debug: false,
});

export default i18n;

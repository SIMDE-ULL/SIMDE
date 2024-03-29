import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    react: {
      useSuspense: true,
    },
    // have a common namespace used around the full app
    ns: ["common"],
    defaultNS: "common",
    debug: false,
    cache: {
      enabled: true,
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
      format: (value, format) => {
        if (format === "uppercase") {
          return value.toUpperCase();
        }
        return value;
      },
    },
  });

export default i18n;

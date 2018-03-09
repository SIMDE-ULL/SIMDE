import * as _i18n from 'i18next';
import XHR from 'i18next-xhr-backend/dist/es/index.js';
import LngDetector from 'i18next-browser-languagedetector/dist/es/index.js';

let i18n = _i18n
.use(XHR)
.use(LngDetector)
.init({
    fallbackLng: 'en',
    react: {
        wait: true
    },
    backend: {
        loadPath: 'locales/{{lng}}/{{ns}}.json'
    },
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: true,
    cache: {
        enabled: true
    },
    interpolation: {
        escapeValue: false,
        formatSeparator: ',',
        format: function (value, format, lng) {
            if (format === 'uppercase') {
                return value.toUpperCase();
            };
            return value;
        }
    }
});

export default i18n;

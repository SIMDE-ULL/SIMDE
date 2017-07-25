import * as i18n from 'i18next';

// Please note thas my change in future releases 
// https://github.com/i18next/i18next-browser-languageDetector/issues/129
import XHR from 'i18next-xhr-backend/dist/es/index.js';
import LngDetector from 'i18next-browser-languagedetector/dist/es/index.js';


i18n
    .use(XHR)
    .use(LngDetector)
    .init({
        fallbackLng: 'en',
        wait: true, // globally set to wait for loaded translations in translate hoc
        backend: {
            loadPath: 'SIMDE-Simulator/locales/{{lng}}/{{ns}}.json',
        },
        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',

        debug: true,

        // cache: {
        //   enabled: true
        // },

        interpolation: {
            escapeValue: false, // not needed for react!!
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

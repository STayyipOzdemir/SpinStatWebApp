// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)             // JSON'ları public'ten çeker
  .use(initReactI18next)
  .init({
    lng: "tr",                  // varsayılan dil
    fallbackLng: "tr",
    ns: ["common", "live", "match", "auth"],
    defaultNS: "common",
    debug: process.env.NODE_ENV === "development",

    backend: {
      // CRA'da PUBLIC_URL build sırasında eklenir; dev'de boş stringtir.
      loadPath: process.env.PUBLIC_URL + "/locales/{{lng}}/{{ns}}.json"
    },

    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;

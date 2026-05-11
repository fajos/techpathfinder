// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./assets/locales/en.json";
import yo from "./assets/locales/yo.json";
import fr from "./assets/locales/fr.json";
import es from "./assets/locales/es.json";

export const initializeI18n = async () => {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      lng: "en",
      fallbackLng: "en",
      resources: {
        en: { translation: en },
        yo: { translation: yo },
        fr: { translation: fr },
        es: { translation: es },
      },
      interpolation: {
        escapeValue: false,
      },
    });
  }
  return i18n;
};

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../public/locales/ar.json';
import en from '../public/locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en', // اللغة الاحتياطية
    interpolation: {
      escapeValue: false, // لا نحتاج إلى الهروب من القيم
    },
  });

export default i18n; 
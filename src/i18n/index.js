import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uzTranslation from './locales/uz.json';
import enTranslation from './locales/en.json';

const savedLanguage = localStorage.getItem('musicuz_lang') || 'uz';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: uzTranslation,
      en: enTranslation,
    },
    lng: savedLanguage,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('musicuz_lang', lng);
});

export default i18n;

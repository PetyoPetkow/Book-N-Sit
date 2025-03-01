import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/en';
import bg from './languages/bg';

const resources = {
  en: {
    translation: en,
  },
  bg: {
    translation: bg,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'bg',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

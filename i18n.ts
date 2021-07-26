import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './src/i18n/ko.json';
import en from './src/i18n/en.json';
import zhHans from './src/i18n/zh-hans.json';

const resources = { ko, en, zhHans };

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

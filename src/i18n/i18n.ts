import i18n from 'i18n-js';

import ko from './ko.json';
import en from './en.json';
import zhHans from './zh-hans.json';
import currentLocalization from '../utiles/currentLocalization';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  ko,
  zhHans,
};

i18n.fallbacks = true;

i18n.locale = currentLocalization();

export default i18n;

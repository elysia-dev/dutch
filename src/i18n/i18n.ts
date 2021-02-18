import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import ko from './ko.json';
import en from './en.json';
import zhHans from './zh-hans.json';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  ko,
  zhHans,
};

i18n.fallbacks = true;

i18n.locale = Localization.locale;

export default i18n;

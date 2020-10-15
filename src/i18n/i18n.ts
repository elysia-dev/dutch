import * as Localization from "expo-localization";
import i18n from "i18n-js";
// import { I18nManager } from 'react-native';
// import * as RNLocalize from 'react-native-localize';
// import AsyncStorage from '@react-native-community/async-storage';

import ko from "./ko.json";
import en from "./en.json";
import zhHans from "./zh-hans.json";


// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  ko,
  zhHans,
};
// const defaultLanguage = { languageTag: AsyncStorage.getItem('i18nLanguage'), isRTL: false };
// const availableLanguages = Object.keys(i18n.translations);

i18n.fallbacks = true;

i18n.locale = Localization.locale;


export default i18n;

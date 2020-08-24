// import I18n from "react-native-i18n";
// import ko from "./ko";

// I18n.fallbacks = false;

// I18n.translations = {
//   ko,
// };

// export default I18n;

// import i18n from "i18next";
// import { initReactI18next, useTranslation } from "react-i18next";

// import Backend from "i18next-xhr-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
// // import { Localization } from 'expo-localization';
// //rn에서는 브라우저의 언어를 감지하지 않고 explo-localization을 통해 languagedetector

// import ko from "./ko.json";
// // import en from "./en.json";

// i18n
//   // load translation using xhr -> see /public/locales
//   // learn more: https://github.com/i18next/i18next-xhr-backend
//   .use(Backend)
//   // detect user language
//   // learn more: https://github.com/i18next/i18next-browser-languageDetector
//   .use(LanguageDetector)
//   // pass the i18n instance to react-i18next.
//   .use(initReactI18next)
//   // init i18next
//   // for all options read: https://www.i18next.com/overview/configuration-options
//   .init({
//     fallbackLng: "ko",
//     debug: true,

//     resources: {
//       ko: {
//         lang: ko,
//       },
//       //   en: {
//       //     lang: en,
//       //   },
//     },

//     ns: ["lang"],

//     interpolation: {
//       escapeValue: false, // not needed for react as it escapes by default
//     },
//   });

// export default i18n;

import * as Localization from "expo-localization";
import i18n from "i18n-js";
import ko from "./ko.json";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  ko,
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;

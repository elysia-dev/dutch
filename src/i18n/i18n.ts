import * as Localization from "expo-localization";
import i18n from "i18n-js";
import ko from "./ko.json";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  ko,
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;

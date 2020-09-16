import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-community/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import LocaleType from "../enums/LocaleType";
import ko from "./ko.json";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  ko,
};
// Set the locale once at the beginning of your app.

interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;
}

const getLocale = async (): Promise<string> => {
  const savedLocale = await AsyncStorage.getItem("@locale");
  return savedLocale!;
};

const defaultLocale = () => {
  if (Localization.locale === "ko-KR") {
    return "ko-KR";
  } else if (Localization.locale === "zh-CN") {
    return "zh-CN";
  } else {
    return "en-US";
  }
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;

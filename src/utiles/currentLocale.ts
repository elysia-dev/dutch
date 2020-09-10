import i18n from "../i18n/i18n";
import LocaleType from "../enums/LocaleType";

const currentLocale = () => {
  if (i18n.currentLocale() === "ko-KR") {
    return LocaleType.KO;
  } else if (i18n.currentLocale() === "zh-CN") {
    return LocaleType.CH;
  } else {
    return LocaleType.EN;
  }
};

export default currentLocale
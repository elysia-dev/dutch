import * as Localization from 'expo-localization';
import LocaleType from '../enums/LocaleType';

const currentLocalization = () => {
  if (Localization.locale === 'ko-KR') {
    return LocaleType.KO;
  } else if (Localization.locale.includes('zh')) {
    return LocaleType.CH;
  } else {
    return LocaleType.EN;
  }
};

export default currentLocalization;

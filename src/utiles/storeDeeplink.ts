import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const storeDeeplink = (iosLink?: string, andLink?: string) => {
  if (Platform.OS === 'ios') {
    Linking.openURL(`https://apps.apple.com/us/app/${iosLink}`);
  } else if (Platform.OS === 'android') {
    Linking.openURL(`https://play.google.com/store/apps/details?id=${andLink}`);
  }
};

export default storeDeeplink;

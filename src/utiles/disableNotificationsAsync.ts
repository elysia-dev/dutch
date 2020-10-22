import AsyncStorage from '@react-native-community/async-storage';
import { unsubscribePusherBeam } from './initPusherbeam';

const disablePushNotificationsAsync = async (email: string) => {
  unsubscribePusherBeam(email);
  await AsyncStorage.setItem('pushNotificationPermission', "denied");
};

export default disablePushNotificationsAsync;

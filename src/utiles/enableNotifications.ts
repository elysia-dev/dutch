import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
import initPusherBeam from './initPusherbeam';

// 초기 빔을 구독할 수있는 경우 구독한다.!
const enablePushNotificationsInit = async (email: string): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();
  const savedValue = await AsyncStorage.getItem('pushNotificationPermission');

  if (
    savedValue === "granted"
    && settings.granted
    || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    initPusherBeam(email);
    return true;
  } else {
    await AsyncStorage.setItem('pushNotificationPermission', "denied");
    return false;
  }
};

export default enablePushNotificationsInit;

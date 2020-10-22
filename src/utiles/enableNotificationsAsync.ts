import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
import initPusherBeam from './initPusherbeam';

const enablePushNotificationsAsync = async (email: string): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();
  if (
    settings.granted
    || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    initPusherBeam(email);
    await AsyncStorage.setItem('pushNotificationPermission', "granted");
    return true;
  } else {
    await AsyncStorage.setItem('pushNotificationPermission', "denied");
    alert('Sorry, we need notification permissions to make this work!');
    return false;
  }
};

export default enablePushNotificationsAsync;

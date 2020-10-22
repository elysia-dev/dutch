import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import initPusherBeam from './initPusherbeam';


// toggle 버튼을 눌러서 구독한다.
const enablePushNotificationsAsync = async (email: string): Promise<boolean> => {
  const res = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  const settings = await Notifications.getPermissionsAsync();

  if (
    res.granted
    || settings.granted
    || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    initPusherBeam(email);
    await AsyncStorage.setItem('pushNotificationPermission', "granted");
    return true;
  } else {
    await AsyncStorage.setItem('pushNotificationPermission', "denied");
    alert('Please change the notification permission in the setting menu for push notification');
    return false;
  }
};

export default enablePushNotificationsAsync;
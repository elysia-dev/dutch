import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import * as Device from 'expo-device';
import getEnvironment from "./getEnvironment";

const canUsePussherBeam = Device.isDevice && getEnvironment().envName !== 'DEVELOPMENT';

const initPusherBeam = (email: string): void => {
  /*
  RNPusherPushNotifications.setInstanceId(getEnvironment().pusherBeamInstanceId);

  RNPusherPushNotifications.subscribe(
    email,
    (_statusCode: object, _response: object) => {
      // console.error(statusCode, response);
    },
    () => { },
  );
  */
};

export const clearPusehrBeam = () => {
  /*
  RNPusherPushNotifications.clearAllState();
  */
};

export const unsubscribePusherBeam = (email: string): void => {
  /*
  RNPusherPushNotifications.unsubscribe(
    email,
    (_statusCode: object, _response: object) => {
      // console.error(statusCode, response);
    },
    () => { },
  );
  */
};

export default initPusherBeam;

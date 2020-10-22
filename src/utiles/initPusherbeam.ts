import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import getEnvironment from "./getEnvironment";

const initPusherBeam = (email: string): void => {
  RNPusherPushNotifications.setInstanceId(getEnvironment().pusherBeamInstanceId);

  RNPusherPushNotifications.subscribe(
    email,
    (_statusCode: object, _response: object) => {
      // console.error(statusCode, response);
    },
    () => { },
  );
};

export const clearPusehrBeam = () => {
  RNPusherPushNotifications.clearAllState();
};

export const unsubscribePusherBeam = (email: string): void => {
  RNPusherPushNotifications.unsubscribe(
    email,
    (_statusCode: object, _response: object) => {
      // console.error(statusCode, response);
    },
    () => { },
  );
};

export default initPusherBeam;

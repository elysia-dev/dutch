import Pusher from 'pusher-js/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import getEnvironment from '../utiles/getEnvironment';

const pusherClient = async () => {
  const token = await AsyncStorage.getItem("@token");

  return new Pusher(getEnvironment().pusherAppKey, {
    cluster: 'ap3',
    authEndpoint: `${getEnvironment().apiUrl}/pusher/auth`,
    auth: {
      headers: { authorization: token },
    },
  });
};

export default pusherClient;

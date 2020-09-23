import Pusher from 'pusher-js/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import { baseURL } from "./axiosInstances";

const pusherClient = async () => {
  const token = await AsyncStorage.getItem("@token");

  return new Pusher('f8163691d5d47ddcfed7', {
    cluster: 'ap3',
    authEndpoint: `${baseURL}/pusher/auth`,
    auth: {
      headers: { authorization: token },
    },
  });
};

export default pusherClient;

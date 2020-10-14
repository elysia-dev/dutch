import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
const { manifest } = Constants;

export const baseURL = `http://${(manifest.debuggerHost || 'localhost')
  .split(':')
  .shift()}:3000`;

export const authenticatedEspressoClient = (
  autoSignOutHandler: () => void,
  token: string,
) => {
  const axiosInstance = axios.create({
    baseURL,
    headers: { authorization: token },
  });

  axiosInstance.interceptors.response.use(
    res => {
      return res;
    },
    e => {
      if (e.response.status === 401) {
        autoSignOutHandler();
      }
    },
  );
  return axiosInstance;
};

export const espressoClient = axios.create({
  baseURL,
});

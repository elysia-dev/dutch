import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
const { manifest } = Constants;

const baseURL = `http://${(manifest.debuggerHost || 'localhost').split(':').shift()}:3000`;

export const authenticatedEspressoClient = async () => {
  const token = await AsyncStorage.getItem("@token");

  return axios.create({
    baseURL,
    headers: { authorization: token },
  });
};

export const espressoClient = axios.create({
  baseURL,
});

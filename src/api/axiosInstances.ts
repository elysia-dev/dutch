import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const baseURL = "http://172.30.1.42:3000";

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

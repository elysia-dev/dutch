import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "android"
    ? "http://172.30.1.18:3000"
    : "http://localhost:3000";

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

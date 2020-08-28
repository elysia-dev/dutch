import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const baseURL = "http://localhost:3000";

export const authenticatedEspressoClient = async () => {
    const token = await AsyncStorage.getItem("@token");

    return axios.create({
        baseURL,
        timeout: 1000,
        headers: { 'authorization': token }
    });
}

export const espressoClient = axios.create({
    baseURL,
    timeout: 1000,
});
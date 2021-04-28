import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('@token');
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem('@token', token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('@token');
}
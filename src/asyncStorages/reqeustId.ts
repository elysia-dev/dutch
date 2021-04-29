import AsyncStorage from "@react-native-async-storage/async-storage";

export const getRequestId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('@requestId');
};

export const setRequestId = async (requestId: string) => {
  await AsyncStorage.setItem('@requestId', requestId);
};


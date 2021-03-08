import * as SecureStore from 'expo-secure-store';

const key = 'ELYSIA_APP_USER_PW';

export const setPassword = async (password: string) => {
  return SecureStore.setItemAsync(key, password);
};

export const validatePassword = async (password: string) => {
  return password === await SecureStore.getItemAsync(key)
};

export const removePassword = async () => {
  return SecureStore.deleteItemAsync(key);
}
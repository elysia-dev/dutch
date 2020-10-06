import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
const { manifest } = Constants;

export const baseURL = `http://${(manifest.debuggerHost || 'localhost')
  .split(':')
  .shift()}:3000`;

// authenticatedEspressoClient의 타입은 ()=>Promise이기 때문에
// app에서 import한 후 바로 interceptor를 붙여줄 수 없음
// 로그인 상태관리 함수를 인자로 받아서 실행한다
export const authenticatedEspressoClient = async (
  signOutHandler: () => void,
) => {
  const token = await AsyncStorage.getItem('@token');

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
        signOutHandler();
      }
    },
  );
  return axiosInstance;
};

// export const authenticatedEspressoClient = async () => {
//   const token = await AsyncStorage.getItem('@token');
//   return axios.create({
//     baseURL,
//     headers: { authorization: token },
//   });
// };

export const espressoClient = axios.create({
  baseURL,
});

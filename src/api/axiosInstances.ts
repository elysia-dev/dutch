import axios from 'axios';
import SignInStatus, { SignOut } from '../enums/SignInStatus';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = getEnvironment().apiUrl;

export const authenticatedEspressoClient = (
  autoSignOutHandler: (signInStatus: SignOut) => void,
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
        autoSignOutHandler(SignInStatus.EXPIRED);
      }
      return Promise.reject(e);
    },
  );
  return axiosInstance;
};

export const espressoClient = axios.create({
  baseURL,
});

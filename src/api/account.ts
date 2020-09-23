import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { AccountResponse, UserResponse } from '../types/AccountResponse';

export default class Api {
  static initializeEmail = async (
    email: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.get(`/auth?email=${email}`);
  };

  static login = async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post('/auth', { email, password });
  };

  static signup = async (
    verificationId: string,
    password: string,
    language: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/users`, {
      verificationId,
      password,
      language,
    });
  };

  static certifyEmail = async (
    verificationId: string,
    code: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.put(`/verifications/${verificationId}`, {
      code, // 유저가 입력한 code
    });
  };

  // 비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  static certifyEmail_recover = async (
    email: string,
    recoverType: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/verifications`, {
      email,
      type: recoverType,
    });
  };

  static recoverPassword = async (
    verificationId: string,
    password: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/auth/recover`, {
      password,
      verificationId,
    });
  };

  static resetPassword = async (
    password: string,
    currentPassword: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return (await authenticatedEspressoClient()).put(`/users`, {
      password,
      currentPassword,
    });
  };

  static me = async (): Promise<AxiosResponse<UserResponse>> => {
    return (await authenticatedEspressoClient()).get('/auth/me');
  };

  static logout = async () => {
    try {
      await AsyncStorage.removeItem('@token');
      return true;
    } catch (exception) {
      return false;
    }
  };
}

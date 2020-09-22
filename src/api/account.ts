import { AxiosResponse } from 'axios';
import { KycStatus } from '../enums/status';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import AsyncStorage from '@react-native-community/async-storage';

type InitializeResponse = {
  verificationId: string;
  status: string;
};

type ResetResponse = {
  status: string;
};

type SignupResponse = {
  token: string;
  status: string;
};
type LoginResponse = {
  token: string;
  status: string;
  counts: number;
  verificationId: string;
};

// 코드 인증하는 함수의 reponse type
type CertifyResponse = {
  counts: number;
  status: string;
};

// verification 요청하는 함수의 response type
type VerificationResponse = {
  verificationId: string;
  status: string;
};

type RecoverResponse = {
  status: string;
};

export type UserResponse = {
  userInfo: {
    email: string;
    kycStatus: KycStatus;
    gender: string;
    firstName: string;
    lastName: string;
  };
  summary: [
    {
      title: string;
      productType: string;
      value: number;
      profit: number;
    },
  ];
  unreadNotificationCount: number;
};

export default class Api {
  static initializeEmail = async (
    email: string,
  ): Promise<AxiosResponse<InitializeResponse>> => {
    return espressoClient.get(`/auth?email=${email}`);
  };

  static login = async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<LoginResponse>> => {
    return espressoClient.post('/auth', { email, password });
  };

  static signup = async (
    verificationId: string,
    password: string,
  ): Promise<AxiosResponse<SignupResponse>> => {
    return espressoClient.post(`/users`, {
      verificationId,
      password,
    });
  };

  static certifyEmail = async (
    verificationId: string,
    code: string,
  ): Promise<AxiosResponse<CertifyResponse>> => {
    return espressoClient.put(`/verifications/${verificationId}`, {
      code, // 유저가 입력한 code
    });
  };

  // 비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  static certifyEmail_recover = async (
    email: string,
    recoverType: string,
  ): Promise<AxiosResponse<VerificationResponse>> => {
    return espressoClient.post(`/verifications`, {
      email,
      type: recoverType,
    });
  };

  static recoverPassword = async (
    verificationId: string,
    password: string,
  ): Promise<AxiosResponse<RecoverResponse>> => {
    return espressoClient.post(`/auth/recover`, {
      password,
      verificationId,
    });
  };

  static resetPassword = async (
    password: string,
    currentPassword: string,
  ): Promise<AxiosResponse<ResetResponse>> => {
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

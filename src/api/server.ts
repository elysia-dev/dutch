/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { AccountResponse, UserResponse } from '../types/AccountResponse';
import { OwnershipResponse } from '../types/Ownership';
import Product, { Story } from '../types/product';
import { Transaction } from '../types/Transaction';
import Notification from '../types/Notification';
import {
  EL_ADDRESS
} from 'react-native-dotenv';
import { TransactionRequestResponse } from '../types/TransactionRequest';
import { BalanceResponse } from '../types/BalanceResponse';
import getEnvironment from '../utiles/getEnvironment';
import { SignOut } from '../enums/SignInStatus';
import LocaleType from '../enums/LocaleType';

export default class Server {
  token: string;
  authenticatedEspressoClient: AxiosInstance;
  constructor(signOutHandler: (signInStatus: SignOut) => void, token: string) {
    this.token = token;
    this.authenticatedEspressoClient = authenticatedEspressoClient(
      signOutHandler,
      this.token,
    );
  }

  initializeEmail = async (
    email: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.get(`/auth?email=${email}&send=false`);
  };

  login = async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post('/auth', { email, password });
  };

  certifyEmail = async (
    verificationId: string,
    code: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.put(`/verifications/${verificationId}`, {
      code, // 유저가 입력한 code
    });
  };

  // 비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  certifyEmail_recover = async (
    email: string,
    recoverType: string,
    language: LocaleType,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/verifications`, {
      email,
      type: recoverType,
      language,
    });
  };

  recoverPassword = async (
    verificationId: string,
    password: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/auth/recover`, {
      password,
      verificationId,
    });
  };

  resetPassword = async (
    password: string,
    currentPassword: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return this.authenticatedEspressoClient.put(`/users`, {
      password,
      currentPassword,
    });
  };

  me = async (): Promise<AxiosResponse<UserResponse>> => {
    return this.authenticatedEspressoClient.get(`/auth/me`);
  };

  registerExpoPushToken = async (
    expoPushToken: string,
  ): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.put('/users/expoPushTokens', {
      expoPushToken,
    });
  };

  deleteExpoPushToken = async (
    expoPushToken: string,
  ): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.delete('/users/expoPushTokens?', {
      data: {
        expoPushToken,
      },
    });
  };

  notification = async (): Promise<AxiosResponse<Notification[]>> => {
    return this.authenticatedEspressoClient.get(`/notifications`);
  };

  read = async (id: number): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.put(`/notifications/${id}`);
  };

  readAll = async (): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.patch('notifications/readAll');
  };

  ownershipDetail = async (
    id: number,
  ): Promise<AxiosResponse<OwnershipResponse>> => {
    return this.authenticatedEspressoClient.get(`/ownerships/${id}`);
  };

  ownershipLegacyRefund = async (id: number): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.post(
      `/ownerships/${id}/legacyRefund`,
    );
  };

  storyList = (language: LocaleType): Promise<AxiosResponse<Story[]>> => {
    return this.authenticatedEspressoClient.get(`/products/stories?language=${language}`);
  };

  productInfo = async (id: number): Promise<AxiosResponse<Product>> => {
    return this.authenticatedEspressoClient.get(`/products?productId=${id}`);
  };

  products = async (): Promise<AxiosResponse<Product[]>> => {
    return this.authenticatedEspressoClient.get(`/products`);
  };

  sendQuestion = async (content: string): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.post('/questions', {
      content,
    });
  };

  sendQuestionWithEmail = (
    email: string,
    content: string,
    language: LocaleType,
  ): Promise<AxiosResponse> => {
    return espressoClient.post(`/land/contact?language=${language}`, {
      email,
      content,
    });
  };

  getTransaction = async (
    id: number,
    page: number,
  ): Promise<AxiosResponse<Transaction[]>> => {
    return this.authenticatedEspressoClient.get(
      `/transactions?ownershipId=${id}&page=${page}`,
    );
  };

  requestTransaction = async (
    productId: number,
    amount: number,
    type: string,
  ): Promise<AxiosResponse<TransactionRequestResponse>> => {
    return this.authenticatedEspressoClient.post('/transactionRequests', {
      productId,
      amount,
      type,
    });
  };

  sendEmailForTransaction = async (
    id: string,
    email?: string,
  ): Promise<AxiosResponse> => {
    if (email) {
      return this.authenticatedEspressoClient.get(
        `/transactionRequests/${id}/sendEmail?email=${email}`,
      );
    }
    return this.authenticatedEspressoClient.get(
      `/transactionRequests/${id}/sendEmail`,
    );
  };

  requestEthAddressRegister = async (): Promise<
    AxiosResponse<TransactionRequestResponse>
  > => {
    return this.authenticatedEspressoClient.post('/ethAddress');
  };

  getBalance = (address: string): Promise<AxiosResponse<BalanceResponse>> => {
    return axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${EL_ADDRESS
      }&address=${address}&tag=latest&apikey=AD6WVV4IKCM7R4764UTDWVA52V7ARDYIP7`,
    );
  };

  setRefundLegacyWallet = async (
    ethAddress: string,
    email: string,
  ): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.post(`/users/refundLegacyWallet`, {
      ethAddress,
      email,
    });
  };

  getTransactionRequest = async (id: string): Promise<AxiosResponse<void>> => {
    return espressoClient.get(`transactionRequests/${id}`);
  };

  deleteUser = async (password: string): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.delete('/users', {
      data: {
        password,
      },
    });
  };

  checkLatestVersion = (platform: string): Promise<AxiosResponse> => {
    return espressoClient.get(`/q/${platform}`);
  };

  checkEthAddressRegisteration = (
    id: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.get(`/ethAddress/${id}/token`);
  };
}

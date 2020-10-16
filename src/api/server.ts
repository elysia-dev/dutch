/* eslint-disable @typescript-eslint/camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { AccountResponse, UserResponse } from '../types/AccountResponse';
import { OwnershipResponse } from '../types/Ownership';
axios.defaults.baseURL = 'http://localhost:3000';
import Product, { ProductId, Story } from '../types/product';
import { PostResponse } from '../types/PostResponse';
import { DocsResponse } from '../types/Docs';
import { Transaction } from '../types/Transaction';
import { SummaryReportResponse } from '../types/SummaryReport';
import { CoinPriceResponse, ELPriceResponse } from '../types/CoinPrice';
import { KycResponse, PhotoResponse } from '../types/Kyc';
import { TransactionRequestResponse } from '../types/TransactionRequest';

export default class Server {
  token: string;
  authenticatedEspressoClient: AxiosInstance;
  autoSignOutHandler: () => void;
  constructor(autoSignOutHandler: () => void, token: string) {
    this.autoSignOutHandler = autoSignOutHandler;
    this.token = token;
    this.authenticatedEspressoClient = authenticatedEspressoClient(
      this.autoSignOutHandler,
      this.token,
    );
  }

  initializeEmail = async (
    email: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.get(`/auth?email=${email}`);
  };

  login = async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post('/auth', { email, password });
  };

  signup = async (
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
  ): Promise<AxiosResponse<AccountResponse>> => {
    return espressoClient.post(`/verifications`, {
      email,
      type: recoverType,
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
    return this.authenticatedEspressoClient.get('/auth/me');
  };

  logout = async () => {
    try {
      await AsyncStorage.removeItem('@token');
      return true;
    } catch (exception) {
      return false;
    }
  };

  photoId = async (
    photo: string,
    idType: string,
  ): Promise<AxiosResponse<PhotoResponse>> => {
    return this.authenticatedEspressoClient.post('/kyc/photoid', {
      photoidImage: photo, // base64 string,
      id_type: idType,
    });
  };

  selfie = async (photo: string): Promise<AxiosResponse<PhotoResponse>> => {
    return this.authenticatedEspressoClient.post('/kyc/photoid', {
      selfieImage: photo, // base64 string,
    });
  };

  submission = async (
    first_name: string,
    last_name: string,
    nationality: string,
    date_of_birth: string,
    gender: string,
    id_type: string,
    photoid_res: string,
    selfie_res: string,
  ): Promise<AxiosResponse<KycResponse>> => {
    return this.authenticatedEspressoClient.post('/kyc/selfie', {
      first_name,
      last_name,
      nationality,
      date_of_birth,
      gender,
      id_type,
      photoid_res,
      selfie_res,
    });
  };
  notification = async (): Promise<AxiosResponse<Notification[]>> => {
    return this.authenticatedEspressoClient.get(`/notifications`);
  };

  read = async (id: number): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.put(`/notifications/${id}`);
  };

  ownershipDetail = async (
    id: number,
  ): Promise<AxiosResponse<OwnershipResponse>> => {
    return this.authenticatedEspressoClient.get(`/ownerships/${id}`);
  };

  ownershipLegacyRefund = async (
    id: number,
  ): Promise<AxiosResponse<void>> => {
    return this.authenticatedEspressoClient.post(`/ownerships/${id}/legacyRefund`);
  };

  storyList = async (): Promise<AxiosResponse<Story[]>> => {
    return this.authenticatedEspressoClient.get('/products/stories');
  };

  productInfo = async (id: number): Promise<AxiosResponse<Product>> => {
    return this.authenticatedEspressoClient.get(`/products?productId=${id}`);
  };

  coinPrice = async (): Promise<AxiosResponse<CoinPriceResponse>> => {
    return axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=elysia,ethereum&vs_currencies=usd',
    );
  };

  productPost = async (id: number): Promise<AxiosResponse<PostResponse[]>> => {
    return this.authenticatedEspressoClient.get(
      `/posts/products?id=${id}`,
    );
  };

  elysiaPost = async (): Promise<AxiosResponse<PostResponse[]>> => {
    return this.authenticatedEspressoClient.get(
      '/posts/elysia',
    );
  };

  productDocs = async (id: number): Promise<AxiosResponse<DocsResponse>> => {
    return this.authenticatedEspressoClient.get(
      `/products/docs?productId=${id}`,
    );
  };

  getAllProductIds = async (): Promise<AxiosResponse<ProductId[]>> => {
    return this.authenticatedEspressoClient.get('/products/ids');
  };

  sendQuestion = async (content: string): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.post('/questions', {
      content,
    });
  };

  getSummaryReport = async (): Promise<
    AxiosResponse<SummaryReportResponse>
  > => {
    return this.authenticatedEspressoClient.get('/reports/summary');
  };

  getTransaction = async (
    id: number,
    page: number,
  ): Promise<AxiosResponse<Transaction[]>> => {
    return this.authenticatedEspressoClient.get(
      `/transactions?ownershipId=${id}&page=${page}`,
    );
  };

  getTransactionHistory = async (
    page: number,
    start: string,
    end: string,
    type: string,
    period: string,
    productId: number,
  ): Promise<AxiosResponse<Transaction[]>> => {
    return this.authenticatedEspressoClient.get(
      `/transactions/history?productId=${productId}&start=${start}&end=${end}&period=${period}&type=${type}&page=${page}`,
    );
  };

  resetLanguage = async (language: string): Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.put(
      '/users/language', { language },
    );
  };

  requestTransaction = async (productId: number, amount: number, type: string):
    Promise<AxiosResponse<TransactionRequestResponse>> => {
    return this.authenticatedEspressoClient.post(
      '/transactionRequests', { productId, amount, type },
    );
  };

  sendEmailForTransaction = async (id: string):
    Promise<AxiosResponse> => {
    return this.authenticatedEspressoClient.get(
      `/transactionRequests/${id}/sendEmail`,
    );
  };

  getELPrice = async (): Promise<AxiosResponse<ELPriceResponse>> => {
    return axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=elysia&vs_currencies=usd',
    );
  };
}

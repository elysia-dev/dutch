import axios, { AxiosResponse } from 'axios';
import CryptoTxsResponse from '../types/CryptoTxsResponse';
import Notification from '../types/Notification';
import Product from '../types/Product';
import WalletBalanceResponse from '../types/WalletBalanceResponse';
import { API_URL } from 'react-native-dotenv';

const baseURL = API_URL;

export default class EspressoV2 {
  static getBalances = async (
    address: string,
    noCache?: boolean,
  ): Promise<AxiosResponse<WalletBalanceResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/balance?cache=${
        noCache ? 'no-cache' : 'null'
      }`,
    );
  };

  static getEthTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/tx?page=${page}&cache=no-cache`,
    );
  };

  static getErc20Transaction = async (
    address: string,
    tokenAddress: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/${tokenAddress}/tx?page=${page}&cache=no-cache`,
    );
  };

  static getBnbTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/tx?page=${page}&network=bsc&cache=no-cache`,
    );
  };

  static getBscErc20Transaction = async (
    address: string,
    tokenAddress: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/${tokenAddress}/tx?page=${page}&network=bsc`,
    );
  };

  static subscribe = async (
    address: string,
    token?: string,
  ): Promise<AxiosResponse<void>> => {
    return axios.post(`${baseURL}/v2/wallet/${address}/token`, {
      token,
    });
  };

  static subscribeExisted = async (
    address: string,
    token?: string,
  ): Promise<AxiosResponse<void>> => {
    return axios.put(`${baseURL}/v2/wallet/${address}/token`, {
      token,
    });
  };

  static unsubsribe = async (
    address: string,
    token?: string,
  ): Promise<AxiosResponse<void>> => {
    return axios.delete(`${baseURL}/v2/wallet/${address}/token`, {
      data: {
        token,
      },
    });
  };

  static getProduct = async (
    address: string,
  ): Promise<AxiosResponse<Product>> => {
    return axios.get(`${baseURL}/products?contractAddress=${address}`);
  };

  static createPendingTxNotification = async (
    address: string,
    contractAddress: string,
    txHash: string,
  ): Promise<AxiosResponse<void>> => {
    return axios.post(`${baseURL}/transactionRequests/pendingTx`, {
      address,
      contractAddress,
      txHash,
    });
  };

  static getNoficiations = async (
    address: string,
  ): Promise<AxiosResponse<Notification[]>> => {
    return axios.get(`${baseURL}/v2/notifications/${address}`);
  };

  static readNotification = async (
    address: string,
    id: number,
  ): Promise<AxiosResponse<void>> => {
    return axios.put(`${baseURL}/v2/notifications/${id}/${address}`);
  };

  static readAllNotifications = async (
    address: string,
  ): Promise<AxiosResponse<void>> => {
    return axios.patch(`${baseURL}/v2/notifications/readAll/${address}`);
  };
}

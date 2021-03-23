import axios, { AxiosResponse } from 'axios';
import CryptoTxsResponse from '../types/CryptoTxsResponse';
import Product from '../types/Product';
import WalletBalanceResponse from '../types/WalletBalanceResponse';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}`;

export default class EspressoV2 {
  static getBalances = async (address: string, noCache?: boolean): Promise<AxiosResponse<WalletBalanceResponse>> => {
    return axios.get(`${baseURL}/v2/wallet/${address}/balance`, {
      headers: {
        'Cache-Control': noCache ? 'no-cache' : null
      }
    });
  }

  static getEthTransaction = async (address: string, page: number): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/tx?page=${page}`,
    )
  }

  static getErc20Transaction = async (address: string, tokenAddress: string, page: number): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}/v2/wallet/${address}/${tokenAddress}/tx?page=${page}`,
    )
  }

  static createUser = async (address: string, expoPushToken?: string): Promise<void> => {
    return Promise.resolve();
  }

  static putExpoPushToken = async (address: string, expoPushToken: string): Promise<void> => {
    return Promise.resolve();
  }

  static removeExpoPushToken = async (address: string, expoPushToken: string): Promise<void> => {
    return Promise.resolve();
  }

  static getProduct = async (address: string): Promise<AxiosResponse<Product>> => {
    return axios.get(
      `${baseURL}/products?contractAddress=${address}`,
    )
  }
}

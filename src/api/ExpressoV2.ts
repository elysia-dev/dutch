import axios, { AxiosResponse } from 'axios';
import CryptoTxsResponse from '../types/CryptoTxsResponse';
import WalletBalanceResponse from '../types/WalletBalanceResponse';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}/v2/`;

export default class ExpressoV2 {
  static getBalances = async (address: string): Promise<AxiosResponse<WalletBalanceResponse>> => {
    return axios.get(
      `${baseURL}wallet/${address}/balance`,
    );
  }

  static getEthTransaction = async (address: string, page: number): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}wallet/${address}/tx?page=${page}`,
    )
  }

  static getErc20Transaction = async (address: string, tokenAddress: string, page: number): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `${baseURL}wallet/${address}/${tokenAddress}/tx?page=${page}`,
    )
  }
}

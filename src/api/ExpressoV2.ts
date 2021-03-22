import axios, { AxiosResponse } from 'axios';
import WalletBalanceResponse from '../types/WalletBalanceResponse';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}/v2/`;

export default class ExpressoV2 {
  static getBalances = async (address: string): Promise<AxiosResponse<WalletBalanceResponse>> => {
    return axios.get(
      `${baseURL}wallet/${address}/balance`,
    );
  }
}

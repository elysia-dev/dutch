import axios, { AxiosResponse } from 'axios';
import { WalletBalacneResponse } from '../types/WalletBalacneResponse';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}/v2/`;

export default class ExpressoV2 {
  static getBalances = async (address: string): Promise<AxiosResponse<WalletBalacneResponse>> => {
    return axios.get(
      `${baseURL}wallet/${address}/balance`,
    );
  }
}

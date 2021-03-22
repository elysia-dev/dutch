import axios, { AxiosResponse } from 'axios';
import BalanceItem from '../types/BalanceItem';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}/v2/`;

export default class ExpressoV2 {
  static getBalances = async (address: string): Promise<AxiosResponse<BalanceItem[]>> => {
    return axios.get(
      `${baseURL}wallet/${address}/balance`,
    );
  }
}

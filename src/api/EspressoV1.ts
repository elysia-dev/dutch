import axios, { AxiosResponse } from 'axios';
import { CurrencyResponse } from '../types/CurrencyResponse';
import getEnvironment from '../utiles/getEnvironment';

const baseURL = `${getEnvironment().apiUrl}`;

export default class EspressoV1 {
  static getAllCurrency = async (): Promise<AxiosResponse<CurrencyResponse[]>> => {
    return axios.get(`${baseURL}/currency`);
  };
}

import axios, { AxiosResponse } from 'axios';
import { CurrencyResponse } from '../types/CurrencyResponse';
import Constants from 'expo-constants';

const baseURL = Constants.manifest?.extra?.apiUrl;

export default class EspressoV1 {
  static getAllCurrency = async (): Promise<AxiosResponse<CurrencyResponse[]>> => {
    return axios.get(`${baseURL}/currency`);
  };
}

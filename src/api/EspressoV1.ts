import axios, { AxiosResponse } from 'axios';
import { CurrencyResponse } from '../types/CurrencyResponse';
import {
  API_URL
} from 'react-native-dotenv';

const baseURL = API_URL;

export default class EspressoV1 {
  static getAllCurrency = async (): Promise<AxiosResponse<CurrencyResponse[]>> => {
    return axios.get(`${baseURL}/currency`);
  };
}

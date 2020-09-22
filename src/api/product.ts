import axios, { AxiosResponse } from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
import { authenticatedEspressoClient, espressoClient } from './axiosInstances';
import Product, { Story } from '../types/product';
import { elysiaPriceResponse, ethereumPriceResponse } from '../types/CoinPrice';

export default class Api {
  static storyList = async (): Promise<AxiosResponse<Story[]>> => {
    return (await authenticatedEspressoClient()).get(`/stories`);
  };

  static productInfo = async (id: number): Promise<AxiosResponse<Product>> => {
    return (await authenticatedEspressoClient()).get(
      `/products?productId=${id}`,
    );
  };

  static elysiaPrice = async (): Promise<
    AxiosResponse<elysiaPriceResponse>
  > => {
    return axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=elysia&vs_currencies=usd`,
    );
  };

  static ethereumPrice = async (): Promise<
    AxiosResponse<ethereumPriceResponse>
  > => {
    return axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
    );
  };
}

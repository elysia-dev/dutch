import axios, { AxiosResponse } from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
import { authenticatedEspressoClient, espressoClient } from './axiosInstances';
import Product, { Story } from '../types/product';
import { elysiaPriceResponse, ethereumPriceResponse } from '../types/CoinPrice';
import { PostResponse } from '../types/PostResponse';
import { DocsResponse } from '../types/Docs';

export default class Api {
  static storyList = async (): Promise<AxiosResponse<Story[]>> => {
    return (await authenticatedEspressoClient()).get('/products/stories');
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
      'https://api.coingecko.com/api/v3/simple/price?ids=elysia&vs_currencies=usd',
    );
  };

  static ethereumPrice = async (): Promise<
    AxiosResponse<ethereumPriceResponse>
  > => {
    return axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );
  };

  static productPost = async (
    id: number,
  ): Promise<AxiosResponse<PostResponse[]>> => {
    return (await authenticatedEspressoClient()).get(
      `/posts/products?id=${id}`,
    );
  };

  static productDocs = async (
    id: number,
  ): Promise<AxiosResponse<DocsResponse>> => {
    return (await authenticatedEspressoClient()).get(
      `/products/docs?productId=${id}`,
    );
  };
}

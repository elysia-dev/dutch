import axios, { AxiosResponse } from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
import { authenticatedEspressoClient } from './axiosInstances';
import Product, { Story } from '../types/product';

export default class Api {
  static storyList = async (): Promise<AxiosResponse<Story[]>> => {
    return (await authenticatedEspressoClient()).get(`/stories`);
  };

  static productInfo = async (id: number): Promise<AxiosResponse<Product>> => {
    return (await authenticatedEspressoClient()).get(
      `/products?productId=${id}`,
    );
  };
}

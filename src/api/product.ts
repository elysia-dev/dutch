import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";
import { authenticatedEspressoClient } from "./axiosInstances";
import Product, { ProductList } from "../types/product";

export default class Api {
  static productList = async (): Promise<AxiosResponse<ProductList[]>> => {
    return (await authenticatedEspressoClient()).get(`/stories`);
  };

  static productInfo = async (id: number): Promise<AxiosResponse<Product>> => {
    return (await authenticatedEspressoClient()).get(`/products/${id}`);
  };
}

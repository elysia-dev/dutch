import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";
import { authenticatedEspressoClient } from "./axiosInstances";
import Product from "../types/product";

export default class Api {
  static products = async (
    payments: string,
    sort: string
  ): Promise<AxiosResponse<Product[]>> => {
    return (await authenticatedEspressoClient()).get(
      `/products/?allowedPayments=${payments}&sortingType=${sort}`
    );
  };
}

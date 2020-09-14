import axios, { AxiosResponse } from "axios";
import Product from "../types/product";
import { espressoClient, authenticatedEspressoClient } from "./axiosInstances";

type TransactionResponse = {
  id: number;
  type: string;
  description: string;
  paymentMethods: string;
  paymentValue: string;
  totlaValue: string;
};

export type OwnershipResponse = {
  id: number;
  userId: number;
  paymentMethod: string;
  paymentValue: string;
  value: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string;
  product: {
    id: number;
    title: string;
    data: Product["data"];
  };
};

export class Api {
  static TransactionHistory = async (
    startDate: string,
    endDate: string,
    period: string,
    sortingType: string,
    paymentMethods: string[]
  ): Promise<AxiosResponse<TransactionResponse[]>> => {
    const paymentMethodsToSend = "";
    paymentMethods.forEach((method, index) => {
      paymentMethodsToSend.concat(`&paymentMethods[${index}]=${method}`);
    });
    return (await authenticatedEspressoClient()).get(
      `/history/transactions?&start=${startDate}&end=${endDate}&period=${period}&sortingType=${sortingType}${paymentMethodsToSend}"`
    );
  };

  static OwnershipHistory = async (
    status: string
  ): Promise<AxiosResponse<OwnershipResponse[]>> => {
    return (await authenticatedEspressoClient()).get(
      `/history/ownerships?status=${status}`
    );
  };
}

import axios, { AxiosResponse } from "axios";
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
  status: string;
  paymentMethod: string;
  paymentValue: string;
  product: {
    title: string;
    images: [];
    expectedAnnualReturn: string;
    returnOnRent: string;
    returnOnSale: string;
  };
};

export default class Api {
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

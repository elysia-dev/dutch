import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";
import AsyncStorage from "@react-native-community/async-storage";

type ProductResponse = {
  productBody: {
    id: number;
    title: string;
    paymentMethods: [];
    data: {
      address: string;
      pricePerToken: number;
      images: [];
      financials: {
        expectedAnnualReturn: string;
        returnOnRent: string;
        returnOnSale: string;
        monthlyRentIncomeDistributionCycle: string;
        lockupPeriod: string;
        expectedSaleDate: string;
        propertyPriceUSD: string;
        propertyPriceKRW: string;
        netDepositUSD: string;
        netDepositKRW: string;
        netRentPerYearUSD: string;
        netRentPerYearKRW: string;
        bankLoan: string;
      };
    };
    propertyHighlightes: {
      propertyType: string;
      Ground: string;
      Underground: string;
      Bedroom: string;
      buldingCompletionDate: string;
      totalParkingAvailable: string;
      airConditioning: string;
      heating: string;
      securityFacilities: string;
    };
  };
};

export default class Api {
  static getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        // value previously stored
        return token;
      }
    } catch (e) {
      // error reading value
      console.error(e);
      return "";
    }
  };

  static products = async (
    payments: string,
    sort: string
  ): Promise<AxiosResponse<ProductResponse>> => {
    return axios.get(
      `/products/?allowedPayments=${payments}&sortingType=${sort}`,
      {
        headers: {
          Authorization: Api.getToken(),
        },
      }
    );
  };
}

import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";
import AsyncStorage from "@react-native-community/async-storage";
import { espressoClient, authenticatedEspressoClient } from "./axiosInstances";

export type ProductResponse = {
  id: number;
  title: string;
  paymentMethods: [];
  data: {
    type: string;
    languages: [];
    images: [];
    buildingCompletionDate: string;
    expectedAnnualReturn: string;
    returnOnRent: string;
    returnOnSale: string;
    pricePerToken: string;
    propertyPrice: string;
    netDeposit: string;
    netRentPerYear: string;
    bankLoan: string;
    descriptions: {
      en: {
        currencyUnit: string;
        monthlyRentIncomeDistributionCycle: string;
        address: string;
        lockupPeriod: string;
        expectedSaleDate: string;
        propertyType: string;
        ground: string;
        underground: string;
        bedroom: string;
        bathroom: string;
        airConditioning: string;
        heating: string;
        securityFacilities: string;
        totalParkingAvailable: string;
        summary: string;
      };
      ko: {
        currencyUnit: string;
        monthlyRentIncomeDistributionCycle: string;
        address: string;
        lockupPeriod: string;
        expectedSaleDate: string;
        propertyType: string;
        ground: string;
        underground: string;
        bedroom: string;
        bathroom: string;
        airConditioning: string;
        heating: string;
        securityFacilities: string;
        totalParkingAvailable: string;
        summary: string;
      };
      ch: {
        currencyUnit: string;
        monthlyRentIncomeDistributionCycle: string;
        address: string;
        lockupPeriod: string;
        expectedSaleDate: string;
        propertyType: string;
        ground: string;
        underground: string;
        bedroom: string;
        bathroom: string;
        airConditioning: string;
        heating: string;
        securityFacilities: string;
        totalParkingAvailable: string;
        summary: string;
      };
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
  ): Promise<AxiosResponse<ProductResponse[]>> => {
    return (await authenticatedEspressoClient()).get(
      `/products/?allowedPayments=${payments}&sortingType=${sort}`
    );
  };
}

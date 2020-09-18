import ProductDescription from "./ProductDescription";
import LocaleType from "../enums/LocaleType";

export type Story = {
  productId: number;
  title: string;
  subTitle: string;
  body: string;
  images: string;
};

type Product = {
  id: number;
  title: string;
  contractAddress: string;
  data: {
    type: string;
    languages: LocaleType[];
    images: string[];
    buildingCompletionDate: string;
    expectedAnnualReturn: string;
    returnOnRent: string;
    returnOnSale: string;
    pricePerToken: string;
    propertyPrice: string;
    netDeposit: string;
    netRentPerYear: string;
    bankLoan: string;
    latitude: string;
    longitude: string;
    descriptions: {
      en: ProductDescription;
      ko: ProductDescription;
      ch: ProductDescription;
    };
  };
};

export default Product;

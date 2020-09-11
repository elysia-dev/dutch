import ProductDescription from "./ProductDescription";
import LocaleType from "../enums/LocaleType";

type Product = {
  id: number;
  title: string;
  allowedPayments: string[];
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
      en: ProductDescription
      ko: ProductDescription
      ch: ProductDescription
    };
  };
};

export default Product;
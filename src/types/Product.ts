import ProductDescription, {
  defaultProductDescription,
} from './ProductDescription';
import LocaleType from '../enums/LocaleType';
import AssetType from '../enums/AssetType';
import PaymentCryptoType from '../enums/PaymentCryptoType';

export type Story = {
  productId: number;
  title: string;
  subTitle: string;
  body: string;
  image: string;
  investmentMethod: AssetType;
  paymentMethod: PaymentCryptoType;
};

type Product = {
  id: number;
  title: string;
  contractAddress: string;
  totalValue: string; // 전체 토큰 수
  expectedAnnualReturn: string;
  presentValue: string; // 이미 팔린 토큰을 제외하고 남은 토큰 수
  tokenName: string;
  usdPricePerToken: number;
  status: string;
  childProducts: Product[];
  financeType: string;
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
      zhHans: ProductDescription;
    };
  };
  restrictedCountries: string[];
  paymentMethod: string;
};

export type ProductId = {
  productId: number;
  title: string;
};

export const defaultProduct = {
  id: 0,
  title: '',
  contractAddress: '',
  totalValue: '0',
  expectedAnnualReturn: '0',
  presentValue: '0',
  tokenName: '',
  usdPricePerToken: 0,
  status: 'pending',
  childProducts: [] as Product[],
  financeType: 'loan',
  data: {
    type: '',
    languages: [] as LocaleType[],
    images: [] as string[],
    buildingCompletionDate: '',
    expectedAnnualReturn: '',
    returnOnRent: '',
    returnOnSale: '',
    pricePerToken: '',
    propertyPrice: '',
    netDeposit: '',
    netRentPerYear: '',
    bankLoan: '',
    latitude: '0',
    longitude: '0',
    descriptions: {
      en: defaultProductDescription,
      ko: defaultProductDescription,
      zhHans: defaultProductDescription,
    },
  },
  restrictedCountries: [''],
  paymentMethod: '',
};

export default Product;

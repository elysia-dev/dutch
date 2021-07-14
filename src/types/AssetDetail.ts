import CryptoType from '../enums/CryptoType';
import ProductStatus from '../enums/ProductStatus';
import CryptoTransaction from './CryptoTransaction';

type AssetDetail = {
  page: number;
  totalSupply: number;
  presentSupply: number;
  reward: number;
  transactions: CryptoTransaction[];
  contractAddress: string;
  paymentMethod: CryptoType | 'NONE';
  legacyRefundStatus?: string;
  images: string[];
  productId: number;
  productStatus: ProductStatus;
  loaded: boolean;
};

export default AssetDetail;

import CryptoType from '../enums/CryptoType';
import CryptoTransaction from '../types/CryptoTransaction';
import Server from '../api/server';
import ProductStatus from '../enums/ProductStatus';
import { Transaction } from '../types/Transaction';
import AssetDetail from '../types/AssetDetail';
import EthersacnClient from '../api/EtherscanClient';
import txResponseToTx from './txResponseToTx';
import Product from '../types/Product';
import { getAssetTokenContract, getBscAssetTokenContract } from './getContract';
import { utils } from 'ethers';

class LoadDetail {
  async ownershipDetail(
    server: Server,
    ownershipId: number,
    page: number,
    legacyTxToCryptoTx: (tx: Transaction) => CryptoTransaction,
  ): Promise<AssetDetail> {
    const res = await server.ownershipDetail(ownershipId);
    const txRes = await server.getTransaction(ownershipId, page);

    return {
      page: 2,
      totalSupply: parseFloat(res.data.product.totalValue),
      presentSupply: parseFloat(res.data.product.presentValue),
      reward: parseFloat(res.data.expectProfit),
      transactions: txRes.data.map((tx) => legacyTxToCryptoTx(tx)),
      contractAddress: res.data.product.contractAddress,
      paymentMethod: res.data.product.paymentMethod.toUpperCase() as CryptoType,
      legacyRefundStatus: res.data.legacyRefundStatus,
      images: res.data.product.data?.images || [],
      productId: res.data.product.id,
      productStatus: res.data.product.status as ProductStatus,
      loaded: true,
    };
  }

  async getTxResponse(
    paymentMethod: string,
    userAddress: string,
    assetAddress: string | undefined,
    page: number,
  ) {
    if (paymentMethod.toUpperCase() === CryptoType.BNB) {
      return await EthersacnClient.getBscErc20Transaction(
        userAddress,
        assetAddress || '',
        page,
      );
    } else {
      return await EthersacnClient.getAssetErc20Transaction(
        userAddress,
        assetAddress || '',
        page,
      );
    }
  }

  async loadV2Detail(
    productData: Product,
    userAddress: string,
    assetAddress: string | undefined,
    page: number,
  ) {
    const contract =
      productData.paymentMethod.toUpperCase() === CryptoType.BNB
        ? getBscAssetTokenContract(assetAddress || '')
        : getAssetTokenContract(assetAddress || '');
    const reward = parseFloat(
      utils.formatEther(await contract?.getReward(userAddress)),
    );
    return {
      page: 2,
      reward,
      contractAddress: assetAddress || '',
      transactions: (
        await this.getTxResponse(
          productData.paymentMethod,
          userAddress,
          assetAddress,
          page,
        )
      ).data.result.map((tx) => txResponseToTx(tx, userAddress)),
      images: productData.data.images || [],
      totalSupply: parseFloat(productData.totalValue),
      presentSupply: parseFloat(productData.presentValue),
      paymentMethod: productData.paymentMethod.toUpperCase() as CryptoType,
      productStatus: productData.status as ProductStatus,
      productId: 0,
      loaded: true,
    };
  }
}

export default LoadDetail;

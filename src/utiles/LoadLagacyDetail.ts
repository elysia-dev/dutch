import CryptoType from '../enums/CryptoType';
import CryptoTransaction from '../types/CryptoTransaction';
import Server from '../api/server';
import ProductStatus from '../enums/ProductStatus';
import { Transaction } from '../types/Transaction';
import LoadAssetDetail from '../types/LoadAssetDetail';
import EthersacnClient from '../api/EtherscanClient';
import { CryptoTxsResultResponse } from '../types/CryptoTxsResponse';
import txResponseToTx from './txResponseToTx';
import Product from '../types/Product';
import { AxiosResponse } from 'axios';
import { getAssetTokenContract, getBscAssetTokenContract } from './getContract';
import { utils } from 'ethers';

class LoadDetail {
  legacyTxToCryptoTx(tx: Transaction): CryptoTransaction {
    return {
      type: ['ownership', 'expectedProfit'].includes(tx.transactionType)
        ? 'in'
        : 'out',
      legacyType: tx.transactionType,
      value: tx.value,
      txHash: tx.hash,
      createdAt: tx.createdAt,
      blockNumber: undefined,
    };
  }

  async ownershipDetailAndGetTx(
    server: Server,
    ownershipId: number,
    page: number,
  ): Promise<LoadAssetDetail> {
    const res = await server.ownershipDetail(ownershipId);
    const txRes = await server.getTransaction(ownershipId, page);

    return {
      page: 2,
      totalSupply: parseFloat(res.data.product.totalValue),
      presentSupply: parseFloat(res.data.product.presentValue),
      reward: parseFloat(res.data.expectProfit),
      transactions: txRes.data.map((tx) => this.legacyTxToCryptoTx(tx)),
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
    let txRes;
    if (paymentMethod.toUpperCase() === CryptoType.BNB) {
      return (txRes = await EthersacnClient.getBscErc20Transaction(
        userAddress,
        assetAddress || '',
        page,
      ));
    } else {
      return (txRes = await EthersacnClient.getAssetErc20Transaction(
        userAddress,
        assetAddress || '',
        page,
      ));
    }
  }

  async loadV2Detail(
    productData: AxiosResponse<Product>,
    userAddress: string,
    assetAddress: string | undefined,
    page: number,
  ) {
    const contract =
      productData.data.paymentMethod.toUpperCase() === CryptoType.BNB
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
          productData.data.paymentMethod,
          userAddress,
          assetAddress,
          page,
        )
      ).data.result.map((tx) => txResponseToTx(tx, userAddress)),
      images: productData.data.data.images || [],
      totalSupply: parseFloat(productData.data.totalValue),
      presentSupply: parseFloat(productData.data.presentValue),
      paymentMethod: productData.data.paymentMethod.toUpperCase() as CryptoType,
      productStatus: productData.data.status as ProductStatus,
      productId: 0,
      loaded: true,
    };
  }
}

export default LoadDetail;

import { ethers } from 'ethers';
import { ETHERSCAN_API, ETH_NETWORK } from 'react-native-dotenv';
import EthersacnClient from '../api/EtherscanClient';
import txResponseToTx from './txResponseToTx';
import {
  CryptoTxsResultResponse,
  Transaction,
} from '../types/CryptoTxsResponse';
import CryptoType from '../enums/CryptoType';
import AppColors from '../enums/AppColors';
import { ChartDataPoint } from 'react-native-responsive-linechart';
import { AxiosResponse } from 'axios';

const provider = new ethers.providers.EtherscanProvider(
  ETH_NETWORK,
  ETHERSCAN_API,
);

/**
 * 차트색을 assetType 따라서 변경해주는 함수
 */
export namespace toAppColor {
  export function toString(assetType: string): AppColors {
    if (assetType === CryptoType.ETH) {
      return AppColors.ETH_BLUE;
    } else if (assetType === CryptoType.BNB) {
      return AppColors.BNB_YELLOW;
    }
    return AppColors.EL_BLUE;
  }
}

export class ChartTransactions {
  private address: string;
  private currentAssetValue: number;
  private assetType: string;

  constructor(address: string, currentAssetValue: number, assetType: string) {
    this.address = address;
    this.currentAssetValue = currentAssetValue;
    this.assetType = assetType;
  }

  /**
   * 트랜잭션의 데이터를 가져오는 메서드
   */
  async getTransactionData(
    day: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> {
    let endBlockNumber: number = await provider.getBlockNumber();
    let startBlockNumber: number = endBlockNumber - 46100 * day;
    try {
      const asset_type = this.assetType;
      if (asset_type === CryptoType.ETH) {
        return await EthersacnClient.getEthTransactionLatest(
          this.address,
          startBlockNumber,
          endBlockNumber,
        );
      } else if (asset_type === CryptoType.BNB) {
        const bnbRes = await EthersacnClient.getBnbLatestBlock();
        endBlockNumber = bnbRes.data.result;
        startBlockNumber = endBlockNumber - 200000 * day;
        return await EthersacnClient.getBnbTransactionLatest(
          this.address,
          startBlockNumber,
          endBlockNumber,
        );
      } else {
        return await EthersacnClient.getErc20TransactionLatest(
          this.address,
          startBlockNumber,
          endBlockNumber,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * value 값을 받은 경우
   */
  subAssetValue(prevAssetValue: number, value: string): number {
    return parseFloat((prevAssetValue - parseFloat(value)).toFixed(2));
  }

  /**
   * value 값을 보낸 경우
   */
  addAssetValue(prevAssetValue: number, value: string): number {
    return parseFloat((prevAssetValue + parseFloat(value)).toFixed(2));
  }

  /**
   * getTransactionChar 호출 시 chart에 들어갈 데이터를 만들어서 리턴
   */
  async getTransactionChart(day: number) {
    try {
      let xyDayValue: ChartDataPoint[] = [];
      let prevValue: number = this.currentAssetValue;
      await (
        await this.getTransactionData(day)
      ).data.result
        .map((tx: Transaction) => {
          return txResponseToTx(tx, this.address);
        })
        .forEach((tx, idx, crypTotxs) => {
          const value: string = crypTotxs[idx - 1]?.value;
          xyDayValue = [
            ...xyDayValue,
            {
              x: crypTotxs.length - idx,
              y:
                idx === 0
                  ? prevValue
                  : crypTotxs[idx - 1].type === 'in'
                  ? (prevValue = this.subAssetValue(prevValue, value))
                  : (prevValue = this.addAssetValue(prevValue, value)),
              dateTime: new Date(tx.createdAt).getTime() / 1000,
            },
          ];
        });
      return xyDayValue.reverse();
    } catch (error) {
      console.error(error);
    }
  }
}

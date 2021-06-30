import { ethers } from 'ethers';
import { ETHERSCAN_API, ETH_NETWORK } from 'react-native-dotenv';
import CryptoType from '../enums/CryptoType';
import AppColors from '../enums/AppColors';
import { ChartDataPoint } from 'react-native-responsive-linechart';
import CryptoTransaction from '../types/CryptoTransaction';
import moment from 'moment';
import ChartTabDays from '../enums/ChartTabDays';

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
  private currentAssetValue: number;

  constructor(currentAssetValue: number) {
    this.currentAssetValue = currentAssetValue;
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
   * chart에 들어갈 데이터를 날짜 별로 분리하여 리턴
   */
  async getTransactionChart(
    day: number,
    txs: CryptoTransaction[],
  ): Promise<ChartDataPoint[] | undefined> {
    try {
      let xyDayValue: ChartDataPoint[] = [];
      let prevValue: number = this.currentAssetValue;
      const currentTime = new Date();
      const fotmatCurTime = moment(currentTime).format('YYYY-MM-DD');
      let weeks: string;
      let month: string;
      if (day === ChartTabDays.OneMonth) {
        month = moment(currentTime).subtract(1, 'M').format('YYYY-MM-DD');
      } else {
        weeks = moment(currentTime).subtract(day, 'days').format('YYYY-MM-DD');
      }
      txs
        .filter((tx, idx) => {
          const txTime = moment(tx.createdAt).format('YYYY-MM-DD');
          if (day === ChartTabDays.OneWeek) {
            return weeks <= txTime && fotmatCurTime >= txTime;
          } else if (day === ChartTabDays.TwoWeeks) {
            return weeks <= txTime && fotmatCurTime >= txTime;
          } else if (day === ChartTabDays.OneMonth) {
            return month <= txTime && fotmatCurTime >= txTime;
          }
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

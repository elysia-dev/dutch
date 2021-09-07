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
    } else if (assetType === CryptoType.BNB || assetType === CryptoType.DAI) {
      return AppColors.BNB_YELLOW;
    }
    return AppColors.EL_BLUE;
  }
}
export class ChartTransactions {
  private currentAssetValue: number;
  private xyDayValue: ChartDataPoint[] = [];

  constructor(currentAssetValue: number) {
    this.currentAssetValue = currentAssetValue;
  }

  addBeforeDate(
    txs: CryptoTransaction[],
    weeks: string,
    month: string,
    periodLastDate: string,
    subLastDay: number,
  ) {
    const lastTxDate = moment(txs[txs.length - 1].createdAt).format(
      'YYYY-MM-DD',
    );
    for (let i = 1; i <= subLastDay; i++) {
      this.xyDayValue = [
        {
          x: this.xyDayValue[0].x - 1,
          y: moment(lastTxDate).isSameOrAfter(weeks || month)
            ? 0
            : this.xyDayValue[0].y,
          dateTime: moment(periodLastDate).subtract(i, 'days').unix(),
        },
        ...this.xyDayValue,
      ];
    }
    return this.xyDayValue;
  }

  addAfterDate(periodResentDate: string, subRecentDay: number) {
    let xyDayValue = this.xyDayValue;
    for (let i = 1; i <= subRecentDay; i++) {
      xyDayValue = [
        ...xyDayValue,
        {
          x: xyDayValue[xyDayValue.length - 1].x + 1,
          y: xyDayValue[xyDayValue.length - 1].y,
          dateTime: moment(periodResentDate).add(i, 'days').unix(),
        },
      ];
    }
    return xyDayValue;
  }

  addNoTxDate(subDate: number, currentTime: Date) {
    let xyDayValue = this.xyDayValue;
    for (let i = subDate; i >= 0; i--) {
      xyDayValue = [
        {
          x: i + 1,
          y: 0,
          dateTime: moment(currentTime)
            .subtract(subDate - i, 'days')
            .unix(),
        },
        ...xyDayValue,
      ];
    }
    return xyDayValue;
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
  async getResentTransactionChart(
    day: number,
    txs: CryptoTransaction[],
  ): Promise<ChartDataPoint[] | undefined> {
    try {
      let prevValue: number = this.currentAssetValue;
      const currentTime = new Date();
      let weeks: string = '';
      let month: string = '';

      if (day === ChartTabDays.OneMonth) {
        month = moment(currentTime).subtract(1, 'M').format('YYYY-MM-DD');
      } else {
        weeks = moment(currentTime).subtract(day, 'days').format('YYYY-MM-DD');
      }

      if (txs.length === 0) {
        const subDate = Math.abs(
          moment(weeks || month).diff(currentTime, 'days'),
        );
        return this.addNoTxDate(subDate, currentTime);
      }

      const txsChartDate = txs.filter((tx) => {
        const txDay = moment(tx.createdAt).format('YYYY-MM-DD');
        return moment(txDay).isSameOrAfter(weeks || month);
      });

      const periodResentDate = moment(txsChartDate[0].createdAt).format(
        'YYYY-MM-DD',
      );
      const periodLastDate = moment(
        txsChartDate[txsChartDate.length - 1].createdAt,
      ).format('YYYY-MM-DD');
      const subLastDay = moment(periodLastDate).diff(weeks || month, 'days'); //
      const subRecentDay = Math.abs(
        moment(currentTime).diff(periodResentDate, 'days'),
      );

      txsChartDate.forEach((tx, idx, crypTotxs) => {
        const value: string = crypTotxs[idx - 1]?.value;
        this.xyDayValue = [
          {
            x: crypTotxs.length - idx + subLastDay,
            y:
              idx === 0
                ? prevValue
                : crypTotxs[idx - 1].type === 'in'
                ? (prevValue = this.subAssetValue(prevValue, value))
                : (prevValue = this.addAssetValue(prevValue, value)),
            dateTime: new Date(tx.createdAt).getTime() / 1000,
          },
          ...this.xyDayValue,
        ];
      });

      this.addBeforeDate(txs, weeks, month, periodLastDate, subLastDay);

      return this.addAfterDate(periodResentDate, subRecentDay);
    } catch (error) {
      console.error(error);
    }
  }
}

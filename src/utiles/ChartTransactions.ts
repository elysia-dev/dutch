import { ChartDataPoint } from 'react-native-responsive-linechart';
import moment from 'moment';
import CryptoType from '../enums/CryptoType';
import AppColors from '../enums/AppColors';
import CryptoTransaction from '../types/CryptoTransaction';
import ChartTabDays from '../enums/ChartTabDays';

/**
 * 차트색을 assetType 따라서 변경해주는 함수
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
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

function setPeriod(txsChartDate: CryptoTransaction[], date: string) {
  const periodRecentDate = moment(txsChartDate[0].createdAt).format(
    'YYYY-MM-DD',
  );
  const periodLastDate = moment(
    txsChartDate[txsChartDate.length - 1].createdAt,
  ).format('YYYY-MM-DD');
  const subLastDay = moment(periodLastDate).diff(date, 'days');
  const subRecentDay = Math.abs(
    moment(new Date()).diff(periodRecentDate, 'days'),
  );
  return { periodRecentDate, periodLastDate, subLastDay, subRecentDay };
}

function setChartValue(
  txsChartDate: CryptoTransaction[],
  prevAssetValue: number,
  date: string,
) {
  let xyDayValue: ChartDataPoint[] = [];
  let prevValue: number = prevAssetValue;
  const { subLastDay } = setPeriod(txsChartDate, date);

  txsChartDate.forEach((tx, idx, crypTotxs) => {
    const value: string = crypTotxs[idx - 1]?.value;
    xyDayValue = [
      {
        x: crypTotxs.length - idx + subLastDay,
        y:
          idx === 0
            ? prevAssetValue
            : crypTotxs[idx - 1].type === 'in'
            ? (prevValue = subAssetValue(prevValue, value))
            : (prevValue = addAssetValue(prevValue, value)),
        dateTime: new Date(tx.createdAt).getTime() / 1000,
      },
      ...xyDayValue,
    ];
  });

  return xyDayValue;
}

function addBeforeDate(
  xyDayValue: ChartDataPoint[],
  txs: CryptoTransaction[],
  date: string,
  txsChartDate: CryptoTransaction[],
) {
  const lastTxDate = moment(txs[txs.length - 1].createdAt).format('YYYY-MM-DD');
  const { subLastDay, periodLastDate } = setPeriod(txsChartDate, date);
  let xyValue = xyDayValue;
  for (let i = 1; i <= subLastDay; i++) {
    xyValue = [
      {
        x: xyValue[0].x - 1,
        y: moment(lastTxDate).isSameOrAfter(date) ? 0 : xyDayValue[0].y,
        dateTime: moment(periodLastDate).subtract(i, 'days').unix(),
      },
      ...xyValue,
    ];
  }
  return xyValue;
}

function addAfterDate(
  xyDayValue: ChartDataPoint[],
  txsChartDate: CryptoTransaction[],
  date: string,
) {
  const { subRecentDay, periodRecentDate } = setPeriod(txsChartDate, date);
  let xyValue = xyDayValue;
  for (let i = 1; i <= subRecentDay; i++) {
    xyValue = [
      ...xyValue,
      {
        x: xyValue[xyValue.length - 1].x + 1,
        y: xyValue[xyValue.length - 1].y,
        dateTime: moment(periodRecentDate).add(i, 'days').unix(),
      },
    ];
  }
  return xyValue;
}

function addNoTxDate(subDate: number) {
  let xyDayValue: ChartDataPoint[] = [];
  for (let i = subDate; i >= 0; i--) {
    xyDayValue = [
      {
        x: i + 1,
        y: 0,
        dateTime: moment(new Date())
          .subtract(subDate - i, 'days')
          .unix(),
      },
      ...xyDayValue,
    ];
  }
  return xyDayValue;
}

function addNoDataInPeriod(prevAssetValue: number, subDate: number) {
  let xyDayValue: ChartDataPoint[] = [];
  for (let i = subDate; i >= 0; i--) {
    xyDayValue = [
      {
        x: i + 1,
        y: prevAssetValue,
        dateTime: moment(new Date())
          .subtract(subDate - i, 'days')
          .unix(),
      },
      ...xyDayValue,
    ];
  }
  return xyDayValue;
}

function setDay(day: number) {
  const currentTime = new Date();
  if (day === ChartTabDays.OneMonth) {
    return moment(currentTime).subtract(1, 'M').format('YYYY-MM-DD');
  } else {
    return moment(currentTime).subtract(day, 'days').format('YYYY-MM-DD');
  }
}

/**
 * xyValue 값을 받은 경우
 */
function subAssetValue(prevAssetValue: number, xyValue: string): number {
  return parseFloat((prevAssetValue - parseFloat(xyValue)).toFixed(2));
}

/**
 * xyValue 값을 보낸 경우
 */
function addAssetValue(prevAssetValue: number, xyValue: string): number {
  return parseFloat((prevAssetValue + parseFloat(xyValue)).toFixed(2));
}

/**
 * chart에 들어갈 데이터를 날짜 별로 분리하여 리턴
 */
export function getTransactionChart(
  prevAssetValue: number,
  day: number,
  txs: CryptoTransaction[],
): ChartDataPoint[] | undefined {
  try {
    let xyDayValue: ChartDataPoint[] = [];
    const date = setDay(day);

    const txsChartDate = txs.filter((tx) => {
      const txDay = moment(tx.createdAt).format('YYYY-MM-DD');
      return moment(txDay).isSameOrAfter(date);
    });
    const subDate = Math.abs(moment(date).diff(new Date(), 'days'));

    if (txs.length === 0) {
      return addNoTxDate(subDate);
    }

    if (txsChartDate.length === 0) {
      return addNoDataInPeriod(prevAssetValue, subDate);
    }

    xyDayValue = setChartValue(txsChartDate, prevAssetValue, date);
    xyDayValue = addBeforeDate(xyDayValue, txs, date, txsChartDate);
    return addAfterDate(xyDayValue, txsChartDate, date);
  } catch (error) {
    console.error(error);
  }
}

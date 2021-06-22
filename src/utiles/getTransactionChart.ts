import { ethers } from 'ethers';
import CryptoTransaction from '../types/CryptoTransaction';
import { ETHERSCAN_API, ETH_NETWORK } from 'react-native-dotenv';
import EthersacnClient from '../api/EtherscanClient';
import txResponseToTx from './txResponseToTx';
import { Transaction } from '../types/CryptoTxsResponse';
import CryptoType from '../enums/CryptoType';
import AppColors from '../enums/AppColors';
import { ChartDataPoint } from 'react-native-responsive-linechart';

const provider = new ethers.providers.EtherscanProvider(
  ETH_NETWORK,
  ETHERSCAN_API,
);

/**
 * 날짜에 따라 데이터를 가져오는 함수
 */
export async function isFilterGraph(
  filterGraph: number,
  address: string,
  prevAssetValue: number,
  assetType: string,
): Promise<ChartDataPoint[] | undefined> {
  try {
    if (filterGraph === 0) {
      return await getTransactionChart(address, 1, prevAssetValue, assetType);
    } else if (filterGraph === 1) {
      return await getTransactionChart(address, 2, prevAssetValue, assetType);
    }
    return await getTransactionChart(address, 4, prevAssetValue, assetType);
  } catch (error) {
    console.log(error);
  }
}

/**
 * 차트색을 assetType 따라서 변경해주는 함수
 */
export function chartColor(assetType: string) {
  if (assetType === CryptoType.ETH) {
    return AppColors.ETH_BLUE;
  } else if (assetType === CryptoType.BNB) {
    return AppColors.BNB_YELLOW;
  }
  return AppColors.EL_BLUE;
}

/**
 * EtherscanClient에서 api를 통신하여 차트에 띄워줄 데이터를 가공하여 리턴
 */
async function getTransactionChart(
  address: string,
  day: number,
  prevAssetValue: number,
  assetType: string,
): Promise<ChartDataPoint[] | undefined> {
  try {
    let xyValue: ChartDataPoint[] = [];
    let graphTx: CryptoTransaction[];
    let graphRes;
    //최근에 생성된 블록넘버를 조회
    let endBlockNumber: number = await provider.getBlockNumber();
    let startBlockNumber: number = endBlockNumber - 46100 * day;
    if (assetType === CryptoType.ETH) {
      graphRes = await EthersacnClient.getEthTransactionLatest(
        address,
        startBlockNumber,
        endBlockNumber,
      );
    } else if (assetType === CryptoType.BNB) {
      const bnbRes = await EthersacnClient.getBnbLatestBlock();
      endBlockNumber = bnbRes.data.result;
      startBlockNumber = endBlockNumber - 200000 * day;
      graphRes = await EthersacnClient.getBnbTransactionLatest(
        address,
        startBlockNumber,
        endBlockNumber,
      );
    } else {
      graphRes = await EthersacnClient.getErc20TransactionLatest(
        address,
        startBlockNumber,
        endBlockNumber,
      );
    }
    graphTx = graphRes.data.result.map((tx: Transaction) =>
      txResponseToTx(tx, address),
    );
    graphTx.forEach((v, idx) => {
      xyValue = [
        ...xyValue,
        {
          x: graphTx.length - idx,
          y:
            idx === 0
              ? prevAssetValue
              : graphTx[idx - 1].type === 'in'
              ? parseFloat(
                  (prevAssetValue =
                    prevAssetValue -
                    parseFloat(graphTx[idx - 1].value)).toFixed(2),
                )
              : parseFloat(
                  (prevAssetValue =
                    prevAssetValue +
                    parseFloat(graphTx[idx - 1].value)).toFixed(2),
                ),
          dateTime: new Date(v.createdAt).getTime() / 1000,
        },
      ];
    });
    return xyValue.reverse();
  } catch (error) {
    console.log(error);
  }
}

import React, { useContext, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartDataPoint } from 'react-native-responsive-linechart';
import Asset, { defaultAsset } from '../../types/Asset';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetItem from '../dashboard/components/AssetItem';
import WrapperLayout from '../../shared/components/WrapperLayout';
import SelectBox from './components/SelectBox';
import { View, Dimensions } from 'react-native';
import TransactionList from '../asset/components/TransactionList';
import NextButton from '../../shared/components/NextButton';
import { useTranslation } from 'react-i18next';
import UserContext from '../../contexts/UserContext';
import { CryptoPage } from '../../enums/pageEnum';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import CryptoTransaction from '../../types/CryptoTransaction';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import { P1Text } from '../../shared/components/Texts';
import txResponseToTx from '../../utiles/txResponseToTx';
import NetworkType from '../../enums/NetworkType';
import TransactionContext from '../../contexts/TransactionContext';
import TxStatus from '../../enums/TxStatus';
import OverlayLoading from '../../shared/components/OverlayLoading';
import AssetContext from '../../contexts/AssetContext';
import { Transaction } from '../../types/CryptoTxsResponse';
import EthersacnClient from '../../api/EtherscanClient';
import AssetGraph from './components/AssetGraph';
import { chartColor, isFilterGraph } from '../../utiles/getTransactionChart';

type ParamList = {
  CryptoDetail: {
    asset: Asset;
  };
};

const Detail: React.FC = () => {
  const { assets } = useContext(AssetContext);
  const route = useRoute<RouteProp<ParamList, 'CryptoDetail'>>();
  const asset =
    assets.find((a) => a.type === route.params.asset.type) || defaultAsset;
  const navigation = useNavigation();
  const [filter, setFilter] = useState<number>(0);
  const [filterGraph, setFilterGraph] = useState<number>(0);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { transactions, counter } = useContext(TransactionContext);
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState<ChartDataPoint[] | undefined>([]);
  const [state, setState] = useState<{
    page: number;
    transactions: CryptoTransaction[];
    lastPage: boolean;
    loading: boolean;
  }>({
    page: 1,
    transactions: [],
    lastPage: true,
    loading: true,
  });
  const [prevAssetValue, setPrevAssetValue] = useState<number>(
    parseFloat(asset.value.toFixed(2)),
  );
  const [appColor, setAppColor] = useState<AppColors>(AppColors.BLACK);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [lastBlock, setLastBlock] = useState<number>(999999999);
  const insets = useSafeAreaInsets();

  const address = isWalletUser
    ? wallet?.getFirstNode()?.address || ''
    : user.ethAddresses[0];

  const loadTxs = async () => {
    let newTxs: CryptoTransaction[] = [];
    let res;

    try {
      /**
       * 첫 블록넘버(endBlock)는 999999999 입력
       * 그 이후로는 처음 10개의 데이터를 가져왔을 때 마지막 블록넘버에서 1을 뺀 값이 들어갑니다.
       * blocknumber 0 ~ 마지막 블록넘버에서 1을 뺀 값 사이에서 블록을 10개 가져옵니다.
       */
      if (asset.type === CryptoType.ETH) {
        res = await EthersacnClient.getEthTransaction(address, lastBlock);
      } else if (asset.type === CryptoType.BNB) {
        res = await EthersacnClient.getBnbTransaction(address, lastBlock);
      } else {
        res = await EthersacnClient.getErc20Transaction(address, lastBlock);
      }

      newTxs = res.data.result.map((tx: Transaction) =>
        txResponseToTx(tx, address),
      );

      /**
       * 데이터를 가져와 마지막 블록넘버를 상태저장
       */
      setLastBlock(newTxs[newTxs.length - 1].blockNumber);
    } catch {
      if (state.page !== 1) {
        alert(t('dashboard.last_transaction'));
      }
    } finally {
      if (newTxs.length !== 0) {
        if (state.page === 1) {
          const pendingTxs = transactions.filter(
            (tx) =>
              tx.cryptoType === asset.type && tx.status === TxStatus.Pending,
          );

          setState({
            ...state,
            page: 2,
            lastPage: false,
            transactions: pendingTxs.concat(
              newTxs.filter(
                (tx) =>
                  tx.txHash && !pendingTxs.find((t) => t.txHash === tx.txHash),
              ),
            ),
            loading: false,
          });
        } else {
          setState({
            ...state,
            page: state.page + 1,
            lastPage: false,
            transactions: [...state.transactions, ...newTxs],
            loading: false,
          });
        }
      } else {
        setState({
          ...state,
          lastPage: true,
          loading: false,
        });
      }
    }
  };

  useEffect(() => {
    loadTxs();
  }, []);

  useEffect(() => {
    getChart();
  }, [filterGraph]);

  /**
   * chart를 띄워주는 함수
   * chartLoading - 차트를 띄워줄 데이터를 가져오기전까지 로딩바 표시 (boolean)
   * AppColor - 차트색을 assetType에 따라 상태변경
   * graphData - 데이터를 가져와 상태값을 저장하여 chart - data props에 전달
   */
  const getChart = async () => {
    try {
      setChartLoading(true);
      setAppColor(chartColor(asset.type));
      setGraphData(
        await isFilterGraph(filterGraph, address, prevAssetValue, asset.type),
      );
      setChartLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const assetTxs = transactions.filter((tx) => tx.cryptoType === asset.type);

    if (assetTxs) {
      setState({
        ...state,
        transactions: assetTxs.concat(
          state.transactions.filter(
            (tx) => tx.txHash && !assetTxs.find((t) => t.txHash === tx.txHash),
          ),
        ),
      });
    }
  }, [counter]);

  return (
    <>
      <WrapperLayout
        title={asset.title + ' ' + t('wallet.crypto_value')}
        isScrolling={true}
        backButtonHandler={() => navigation.goBack()}
        body={
          <BasicLayout>
            <AssetItem asset={asset} touchable={false} />

            <SelectBox
              options={['7 days', '14 days', '30 days']}
              selected={filterGraph}
              select={(filterGraph) => {
                setFilterGraph(filterGraph);
              }}
            />
            <AssetGraph
              data={graphData}
              lineColor={appColor}
              chartLoading={chartLoading}
            />
            <View style={{ height: 30 }} />
            <SelectBox
              options={['ALL', 'OUT', 'IN']}
              selected={filter}
              select={(filter) => setFilter(filter)}
            />
            <TransactionList
              loading={state.loading}
              data={
                state.loading
                  ? []
                  : filter === 0
                  ? state.transactions
                  : state.transactions.filter(
                      (tx) =>
                        (filter === 1 && tx.type === 'out') ||
                        (filter === 2 && tx.type === 'in'),
                    )
              }
              unit={asset.unit}
              networkType={
                asset.type === CryptoType.BNB
                  ? NetworkType.BSC
                  : NetworkType.ETH
              }
            />
            <View style={{ height: 50 }} />
            {!state.lastPage && (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColors.MAIN,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginTop: 15,
                  marginBottom: 70,
                }}
                onPress={() => {
                  loadTxs();
                }}>
                <P1Text
                  style={{
                    color: AppColors.MAIN,
                    fontSize: 17,
                    textAlign: 'center',
                  }}
                  label={t('dashboard_label.more_transactions')}
                />
              </TouchableOpacity>
            )}
          </BasicLayout>
        }
      />
      {(!!user.ethAddresses[0] || isWalletUser) && (
        <View
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: insets.bottom || 10,
            width: '90%',
          }}>
          <NextButton
            style={{
              width:
                Dimensions.get('window').width * (isWalletUser ? 0.42 : 0.9),
            }}
            title={t('wallet.deposit')}
            handler={() => {
              navigation.navigate(CryptoPage.Deposit);
            }}
          />
          {isWalletUser && (
            <NextButton
              style={{
                width: Dimensions.get('window').width * 0.42,
              }}
              title={t('wallet.withdrawal')}
              handler={() => {
                navigation.navigate(CryptoPage.Withdrawal, {
                  asset,
                });
              }}
            />
          )}
        </View>
      )}
      <OverlayLoading visible={state.loading} />
    </>
  );
};

export default Detail;

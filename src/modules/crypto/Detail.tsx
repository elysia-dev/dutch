import React, { useContext, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartDataPoint } from 'react-native-responsive-linechart';
import { View, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Asset, { defaultAsset } from '../../types/Asset';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetItem from '../dashboard/components/AssetItem';
import WrapperLayout from '../../shared/components/WrapperLayout';
import SelectBox from './components/SelectBox';
import TransactionList from '../asset/components/TransactionList';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import { CryptoPage } from '../../enums/pageEnum';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import CryptoTransaction from '../../types/CryptoTransaction';
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
import { ChartTransactions, toAppColor } from '../../utiles/ChartTransactions';
import SelectType from '../../enums/SelectType';
import { changeTxStatus, getPendingTx } from '../../utiles/pendingTransaction';
import { DAI_ADDRESS, ELFI_ADDRESS, EL_ADDRESS } from 'react-native-dotenv';

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
  const [filterDay, setFilterDay] = useState<number>(7);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { transactions } = useContext(TransactionContext);
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
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [isChartLine, setIsChartLine] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const address = isWalletUser
    ? wallet?.getFirstNode()?.address || ''
    : user.ethAddresses[0];

  const chartTransactions = new ChartTransactions(prevAssetValue);
  const loadTxs = async () => {
    let newTxs: CryptoTransaction[] = [];
    let res;
    try {
      if (asset.type === CryptoType.ETH) {
        res = await EthersacnClient.getEthTransaction(address, state.page);
      } else if (asset.type === CryptoType.BNB) {
        res = await EthersacnClient.getBnbTransaction(address, state.page);
      } else if (asset.type === CryptoType.ELFI) {
        res = await EthersacnClient.getErc20Transaction(
          address,
          ELFI_ADDRESS,
          state.page,
        );
      } else if (asset.type === CryptoType.DAI) {
        res = await EthersacnClient.getErc20Transaction(
          address,
          DAI_ADDRESS,
          state.page,
        );
      } else {
        res = await EthersacnClient.getErc20Transaction(
          address,
          EL_ADDRESS,
          state.page,
        );
      }

      if (res.data.result.length === 0 && state.page >= 2) {
        alert(t('dashboard.last_transaction'));
        return;
      }
      newTxs = res.data.result.map((tx: Transaction) =>
        txResponseToTx(tx, address),
      );
    } catch {
      if (state.page !== 1) {
        alert(t('dashboard.last_transaction'));
      }
    } finally {
      if (newTxs.length !== 0) {
        if (state.page === 1) {
          const pendingTxs = getPendingTx(transactions, '', asset.type);
          let isCurrentPendingTx = true;
          if (pendingTxs.length > 0) {
            isCurrentPendingTx =
              newTxs.findIndex((tx) => pendingTxs[0].txHash === tx.txHash) !==
              -1;
          }
          setState({
            ...state,
            page: 2,
            lastPage: false,
            transactions: isCurrentPendingTx
              ? newTxs
              : pendingTxs.concat(newTxs),
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

  const isSuccessTx = (sendingTxStatus?: TxStatus) => {
    return sendingTxStatus === TxStatus.Success;
  };

  const changedTxStatusToSuccess = (sendingTx: CryptoTransaction) => {
    let resentTx = state.transactions.findIndex(
      (tx) => tx.txHash === sendingTx.txHash,
    );
    state.transactions[resentTx] = sendingTx;
  };

  useEffect(() => {
    const sendingTx = transactions[0];
    const notPendingTxs = state.transactions.filter(
      (tx) => tx.status !== TxStatus.Pending,
    );
    if (isSuccessTx(sendingTx?.status)) {
      changedTxStatusToSuccess(sendingTx);
    }
    setState({
      ...state,
      transactions:
        sendingTx?.status === TxStatus.Pending
          ? [sendingTx, ...notPendingTxs]
          : [...state.transactions],
    });
  }, [transactions]);

  useEffect(() => {
    if (address) {
      setGraphData([]);
      setIsChartLine(false);
      if (state.transactions.length && state.page >= 2) {
        setChartLoading(true);
        getChart();
      } else if (state.loading === false) {
        setChartLoading(false);
      }
    } else {
      setChartLoading(false);
    }
  }, [filterDay, state.transactions.length, state.loading, setChartLoading]);

  /**
   * chart를 띄워주는 함수
   * chartLoading - 차트를 띄워줄 데이터를 가져오기전까지 로딩바 표시 (boolean)
   * chartTransactions class의 getTransactionChart에서 차트에 들어갈 데이터를 가져옵니다.
   * filterChart는 차트 상단에 보면 7일 14일 30일을 탭 할 때 기간에 맞는 데이터가 들어갑니다.
   */
  const getChart = async () => {
    try {
      setGraphData(
        await chartTransactions.getTransactionChart(
          filterDay,
          state.transactions,
        ),
      );
      setChartLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTxs();
  }, []);

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
              selected={filterDay}
              select={(filterDay) => {
                setFilterDay(filterDay);
              }}
              selectType={SelectType.Day}
            />
            <View style={{ height: 50 }} />
            <AssetGraph
              data={graphData}
              lineColor={toAppColor.toString(asset.type)}
              chartLoading={chartLoading}
              setIsChartLine={setIsChartLine}
              isChartLine={isChartLine}
            />
            <View style={{ height: 30 }} />
            <SelectBox
              options={['ALL', 'OUT', 'IN']}
              selected={filter}
              select={(filter) => setFilter(filter)}
              selectType={SelectType.List}
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

import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../shared/components/BackButton';
import {
  H2Text,
  H4Text,
  P1Text,
  P2Text,
  TitleText,
} from '../../shared/components/Texts';
import Asset from '../../types/Asset';
import AppColors from '../../enums/AppColors';
import { AssetPage } from '../../enums/pageEnum';
import CryptoType from '../../enums/CryptoType';
import PreferenceContext from '../../contexts/PreferenceContext';
import UserContext from '../../contexts/UserContext';
import CryptoTransaction from '../../types/CryptoTransaction';
import SelectBox from './components/SelectBox';
import NextButton from '../../shared/components/NextButton';
import PriceContext from '../../contexts/PriceContext';
import EspressoV2 from '../../api/EspressoV2';
import WalletContext from '../../contexts/WalletContext';
import txResponseToTx from '../../utiles/txResponseToTx';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import ProductStatus from '../../enums/ProductStatus';
import NetworkType from '../../enums/NetworkType';
import ProductImageCarousel from '../../shared/components/ProductImageCarousel';
import { Transaction as TransactionType } from '../../types/Transaction';
import LoadDetail from '../../utiles/LoadLagacyDetail';
import AssetDetail from '../../types/AssetDetail';
import TransactionItem from './components/TransactionItem';
import TransactionContext from '../../contexts/TransactionContext';
import TxStatus from '../../enums/TxStatus';
import { getPendingTx } from '../../utiles/pendingTransaction';
import TransactionItemSkeleton from './components/TransactionItemSkeleton';
import Skeleton from '../../shared/components/Skeleton';

const legacyTxToCryptoTx = (tx: TransactionType): CryptoTransaction => {
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
};

type ParamList = {
  Detail: {
    asset: Asset;
  };
};

const Detail: FunctionComponent = () => {
  const loadDetail = new LoadDetail();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const asset = route.params.asset;
  const { currencyFormatter } = useContext(PreferenceContext);
  const { transactions } = useContext(TransactionContext);
  const { Server, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { t } = useTranslation();
  const [state, setState] = useState<AssetDetail>({
    page: 1,
    totalSupply: 0,
    presentSupply: 0,
    reward: 0,
    transactions: [],
    contractAddress: '',
    paymentMethod: CryptoType.EL,
    images: [],
    productId: 0, // for v1 user
    productStatus: ProductStatus.SALE,
    loaded: false,
  });
  const [filter, setFilter] = useState<number>(0);
  const { getCryptoPrice } = useContext(PriceContext);

  const userAddress = wallet?.getFirstNode()?.address || user.ethAddresses[0];
  const loadDetailTx = async () => {
    try {
      if (asset.ownershipId) {
        setState(
          await loadDetail.ownershipDetail(
            Server,
            asset.ownershipId,
            state.page,
            legacyTxToCryptoTx,
          ),
        );
      } else {
        const productData = await EspressoV2.getProduct(asset.address || '');
        const resState = await loadDetail.loadV2Detail(
          productData.data,
          userAddress,
          asset.address,
          state.page,
        );
        const pendingTxs = getPendingTx(transactions, resState.productId);
        let isCurrentPendingTx = true;
        if (pendingTxs.length > 0) {
          isCurrentPendingTx =
            resState.transactions.findIndex(
              (tx) => pendingTxs[0].txHash === tx.txHash,
            ) !== -1;
        }
        setState({
          page: 1,
          totalSupply: resState.totalSupply,
          presentSupply: resState.presentSupply,
          reward: resState.reward,
          transactions: isCurrentPendingTx
            ? resState.transactions
            : pendingTxs.concat(resState.transactions),
          contractAddress: resState.contractAddress,
          paymentMethod: resState.paymentMethod,
          images: resState.images,
          productId: resState.productId, // for v1 user
          productStatus: ProductStatus.SALE,
          loaded: resState.loaded,
        });
      }
    } catch (e) {
      alert(t('account_errors.server'));
      navigation.goBack();
    }
  };

  const loadV2More = async () => {
    let newTxs: CryptoTransaction[] = [];
    let res;

    try {
      if (state.paymentMethod === CryptoType.BNB) {
        res = await EspressoV2.getBscErc20Transaction(
          userAddress || '',
          asset.address || '',
          state.page + 1,
        );
      } else {
        res = await EspressoV2.getErc20Transaction(
          userAddress || '',
          asset.address || '',
          state.page + 1,
        );
      }

      newTxs = res.data.tx.map((tx) => {
        return txResponseToTx(tx, userAddress || '');
      });
    } catch {
      if (state.page !== 1) {
        alert(t('dashboard.last_transaction'));
      }
    } finally {
      if (newTxs.length !== 0) {
        setState({
          ...state,
          page: state.page + 1,
          transactions: [...state.transactions, ...newTxs],
        });
      } else {
        alert(t('dashboard.last_transaction'));
      }
    }
  };
  const loadV1TxsMore = async () => {
    if (!asset.ownershipId) return;

    try {
      const txRes = await Server.getTransaction(asset.ownershipId, state.page);
      const nextTxs = txRes.data.map((tx) => legacyTxToCryptoTx(tx));
      if (nextTxs.length === 0) {
        alert(t('dashboard.last_transaction'));
        return;
      }
      setState({
        ...state,
        page: state.page + 1,
        transactions: [...state.transactions, ...nextTxs],
      });
    } catch {
      alert(t('dashboard.last_transaction'));
    }
  };

  useEffect(() => {
    loadDetailTx();
  }, []);

  const isSuccessTx = (sendingTxStatus?: TxStatus) => {
    return sendingTxStatus === TxStatus.Success;
  };

  const changedTxStatusToSuccess = (sendingTx: CryptoTransaction) => {
    const resentTx = state.transactions.findIndex(
      (tx) => tx.txHash === sendingTx?.txHash,
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

  return (
    <>
      <FlatList
        style={{ backgroundColor: AppColors.WHITE }}
        data={
          filter === 0
            ? state.transactions
            : state.transactions.filter(
                (tx) =>
                  (filter === 1 && tx.type === 'out') ||
                  (filter === 2 && tx.type === 'in'),
              )
        }
        renderItem={({ item }) => {
          return (
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <TransactionItem
                paymentMethod={state.paymentMethod}
                contractAddress={state.contractAddress}
                transaction={item}
                unit={route.params.asset.unit}
                networkType={
                  state.paymentMethod === CryptoType.BNB
                    ? NetworkType.BSC
                    : NetworkType.ETH
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={() => {
          if (state.loaded) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  height: 200,
                  alignItems: 'center',
                }}>
                <P2Text
                  label={t('assets.null_transaction')}
                  style={{ textAlign: 'center', width: '100%' }}
                />
              </View>
            );
          } else {
            return (
              <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
              </View>
            );
          }
        }}
        horizontal={false}
        keyExtractor={(item, index) => String(index)}
        nestedScrollEnabled={false}
        ListHeaderComponent={() => {
          return (
            <>
              <View
                style={{
                  top: 0,
                  width: '100%',
                  height: 293,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <ProductImageCarousel images={state.images} />
                <View style={{ position: 'absolute', padding: 20 }}>
                  <View
                    style={{
                      position: 'absolute',
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: AppColors.BACKGROUND_WHITE,
                      marginLeft: 12,
                      marginTop: 32,
                    }}
                  />
                  <BackButton handler={() => navigation.goBack()} />
                </View>
              </View>
              <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                <H4Text
                  style={{ marginTop: 20, color: AppColors.BLACK2 }}
                  label={asset.unit + ' ' + t('main.assets')}
                />
                <TitleText
                  style={{ marginTop: 10, color: AppColors.BLACK }}
                  label={currencyFormatter(
                    asset.value * getCryptoPrice(asset.type),
                    2,
                  )}
                />
                <View
                  style={{
                    marginTop: 20,
                    height: 1,
                    backgroundColor: AppColors.GREY,
                  }}
                />
                {[
                  { left: t('main.assets_name'), right: asset.title },
                  {
                    left: t('main.assets_value'),
                    right: `${asset.value.toFixed(2)} ${asset.unit}`,
                  },
                  {
                    left: t('main.assets_stake'),
                    right: `${((asset.value / state.totalSupply) * 100).toFixed(
                      2,
                    )}%`,
                  },
                ].map((data, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 60,
                        borderBottomWidth: 1,
                        borderBottomColor: AppColors.GREY,
                      }}>
                      <P1Text
                        style={{ color: AppColors.BLACK2 }}
                        label={data.left}
                      />
                      {state.loaded ? (
                        <H4Text
                          style={{ color: AppColors.BLACK }}
                          label={data.right}
                        />
                      ) : (
                        <Skeleton width={70} height={17} radius={2} />
                      )}
                    </View>
                  );
                })}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 60,
                    borderBottomWidth: 1,
                    borderBottomColor: AppColors.GREY,
                  }}>
                  <H4Text
                    style={{ color: AppColors.BLACK }}
                    label={t('main.total_assets_yield')}
                  />
                  {state.loaded ? (
                    <View>
                      <H4Text
                        style={{ color: AppColors.MAIN, textAlign: 'right' }}
                        label={currencyFormatter(state.reward, 2)}
                      />
                      {state.paymentMethod !== CryptoType.None && (
                        <H4Text
                          style={{
                            color: AppColors.BLACK2,
                            textAlign: 'right',
                          }}
                          label={`${(
                            state.reward / getCryptoPrice(state.paymentMethod)
                          ).toFixed(2)} ${state.paymentMethod.toUpperCase()}`}
                        />
                      )}
                    </View>
                  ) : (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Skeleton width={50} height={17} radius={2} />
                      <Skeleton width={85} height={16} radius={2} />
                    </View>
                  )}
                </View>
                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  {!asset.isLegacyOwnership && (
                    <>
                      <CircularButtonWithLabel
                        label={t('main.ownership')}
                        icon={'+'}
                        disabled={
                          !state.loaded ||
                          state.productStatus !== ProductStatus.SALE
                        }
                        pressHandler={() => {
                          navigation.navigate(AssetPage.Purchase, {
                            assetInCrypto: {
                              type: state.paymentMethod,
                              title: state.paymentMethod.toUpperCase(),
                              unit: state.paymentMethod.toUpperCase(),
                            },
                            assetInToken: asset,
                            contractAddress: state.contractAddress,
                            productId: state.productId,
                            remainingSupplyInToken: state.presentSupply,
                          });
                        }}
                      />
                      <CircularButtonWithLabel
                        label={t('main.refund')}
                        icon={'-'}
                        disabled={!state.loaded}
                        pressHandler={() => {
                          navigation.navigate(AssetPage.Refund, {
                            assetInCrypto: {
                              type: state.paymentMethod,
                              title: state.paymentMethod.toUpperCase(),
                              unit: state.paymentMethod.toUpperCase(),
                            },
                            assetInToken: asset,
                            contractAddress: state.contractAddress,
                            productId: state.productId,
                          });
                        }}
                      />
                      <CircularButtonWithLabel
                        label={t('main.return')}
                        icon={'⤴'}
                        disabled={!state.loaded}
                        pressHandler={() => {
                          navigation.navigate(AssetPage.Reward, {
                            toCrypto: state.paymentMethod,
                            toTitle: state.paymentMethod.toUpperCase(),
                            contractAddress: state.contractAddress,
                            productId: state.productId,
                          });
                        }}
                      />
                    </>
                  )}
                </View>
                {asset.isLegacyOwnership && (
                  <View style={{ width: '100%', marginBottom: 20 }}>
                    <NextButton
                      disabled={state.legacyRefundStatus === 'pending'}
                      title={t(
                        state.legacyRefundStatus === 'pending'
                          ? 'dashboard_label.withdraw_stake_pending'
                          : 'dashboard_label.withdraw_stake_legacy',
                      )}
                      handler={() => {
                        navigation.navigate(AssetPage.LegacyOwnershipRefund, {
                          ownershipId: asset.ownershipId,
                        });
                      }}
                    />
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 15,
                  backgroundColor: AppColors.BACKGROUND_GREY,
                }}
              />
              <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                <H2Text
                  label={t('main.transaction_list')}
                  style={{ marginTop: 20 }}
                />
                <View style={{ height: 20 }} />
                <SelectBox
                  options={['ALL', 'OUT', 'IN']}
                  selected={filter}
                  select={(filter) => setFilter(filter)}
                />
              </View>
            </>
          );
        }}
        ListFooterComponent={() => {
          if (state.loaded) {
            return (
              <TouchableOpacity
                style={{
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColors.MAIN,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: '5%',
                  marginRight: '5%',
                }}
                onPress={() => {
                  if (asset.ownershipId) {
                    loadV1TxsMore();
                  } else {
                    loadV2More();
                  }
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
            );
          } else {
            return null;
          }
        }}
      />
    </>
  );
};

export default Detail;

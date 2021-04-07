import React, { useContext, useEffect, useState } from 'react';
import BasicLayout from '../../shared/components/BasicLayout';
import Asset from '../../types/Asset';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import EspressoV2 from '../../api/EspressoV2';
import CryptoTransaction from '../../types/CryptoTransaction';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import { P1Text } from '../../shared/components/Texts';
import getEnvironment from '../../utiles/getEnvironment';
import txResponseToTx from '../../utiles/txResponseToTx';
import NetworkType from '../../enums/NetworkType';
import TransactionContext from '../../contexts/TransactionContext';
import TxStatus from '../../enums/TxStatus';

type ParamList = {
  CryptoDetail: {
    asset: Asset;
  };
};

const Detail: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'CryptoDetail'>>();
  const asset = route.params.asset
  const navigation = useNavigation();
  const [filter, setFilter] = useState<number>(0);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { transactions, counter } = useContext(TransactionContext);
  const { t } = useTranslation();
  const [state, setState] = useState<{ page: number, transactions: CryptoTransaction[], lastPage: boolean, }>({
    page: 1,
    transactions: [],
    lastPage: true,
  })

  const loadTxs = async () => {
    const address = isWalletUser ? wallet?.getFirstNode()?.address || '' : user.ethAddresses[0];

    let newTxs: CryptoTransaction[] = [];
    let res;

    try {
      if (asset.type === CryptoType.ETH) {
        res = await EspressoV2.getEthTransaction(address, state.page);
      } else if (asset.type === CryptoType.BNB) {
        res = await EspressoV2.getBnbTransaction(address, state.page);
      } else {
        res = await EspressoV2.getErc20Transaction(address, getEnvironment().elAddress, state.page);
      }

      newTxs = res.data.tx.map((tx) => {
        return txResponseToTx(tx, address)
      })
    } catch {
      if (state.page !== 1) {
        alert(t('dashboard.last_transaction'))
      }
    } finally {
      if (newTxs.length !== 0) {
        if (state.page === 1) {
          setState({
            ...state,
            page: state.page + 1,
            lastPage: false,
            transactions: [
              ...transactions.filter((tx) => tx.cryptoType === asset.type && tx.status === TxStatus.Pending),
              ...state.transactions,
              ...newTxs
            ],
          })
        } else {
          setState({
            ...state,
            page: state.page + 1,
            lastPage: false,
            transactions: [
              ...state.transactions,
              ...newTxs
            ],
          })
        }
      } else {
        setState({
          ...state,
          lastPage: true,
        })
      }
    }
  }

  useEffect(() => {
    loadTxs();
  }, [])

  useEffect(() => {
    const assetTxs = transactions.filter((tx) => tx.cryptoType === asset.type)

    if (assetTxs) {
      setState({
        ...state,
        transactions: assetTxs.concat(state.transactions.filter((tx) => tx.txHash && !assetTxs.find((t) => t.txHash === tx.txHash))),
      })
    }
  }, [counter])

  return (
    <>
      <WrapperLayout
        title={route.params.asset.title + " " + t('wallet.crypto_value')}
        isScrolling={true}
        backButtonHandler={() => navigation.goBack()}
        body={
          <BasicLayout>
            <AssetItem
              asset={route.params.asset}
              touchable={false}
            />
            <View style={{ height: 30 }} />
            <SelectBox
              options={['ALL', 'OUT', 'IN']}
              selected={filter}
              select={(filter) => setFilter(filter)}
            />
            <TransactionList
              data={
                filter === 0 ? state.transactions : state.transactions.filter((tx) =>
                  (filter === 1 && tx.type === 'out') || (filter === 2 && tx.type === 'in')
                )
              }
              unit={route.params.asset.unit}
              networkType={asset.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH}
            />
            <View style={{ height: 50 }} />
            {
              !state.lastPage && <TouchableOpacity
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColors.MAIN,
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginTop: 15,
                  marginBottom: 70
                }}
                onPress={() => {
                  loadTxs()
                }}
              >
                <P1Text
                  style={{
                    color: AppColors.MAIN,
                    fontSize: 17,
                    textAlign: 'center',
                  }}
                  label={t('dashboard_label.more_transactions')}
                />
              </TouchableOpacity>
            }
          </BasicLayout>
        }
      />
      {
        (!!user.ethAddresses[0] || isWalletUser) &&
        <View
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 10,
            backgroundColor: 'white',
            width: '90%',
          }}
        >
          <NextButton
            style={{
              width: Dimensions.get('window').width * (isWalletUser ? 0.42 : 0.9)
            }}
            title={t('wallet.deposit')}
            handler={() => {
              navigation.navigate(CryptoPage.Deposit)
            }}
          />
          {
            isWalletUser && <NextButton
              style={{
                width: Dimensions.get('window').width * 0.42
              }}
              title={t('wallet.withdrawal')}
              handler={() => {
                navigation.navigate(CryptoPage.Withdrawal, {
                  asset,
                })
              }}
            />
          }
        </View>
      }
    </>
  );
};

export default Detail

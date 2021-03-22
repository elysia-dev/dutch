import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../shared/components/BackButton';
import { H2Text, H4Text, P1Text, TitleText } from '../../shared/components/Texts';
import Asset from '../../types/Asset';
import TransactionList from './components/TransactionList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import AppColors from '../../enums/AppColors';
import { AssetPage } from '../../enums/pageEnum';
import CryptoType from '../../enums/CryptoType';
import PreferenceContext from '../../contexts/PreferenceContext';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';
import CryptoTransaction from '../../types/CryptoTransaction';
import usePrices from '../../hooks/usePrice';
import { Transaction } from '../../types/Transaction';
import SelectBox from './components/SelectBox';

const legacyTxToCryptoTx = (tx: Transaction): CryptoTransaction => {
  return {
    type: ['ownership', 'expectedProfit'].includes(tx.transactionType) ? 'in' : 'out',
    legacyType: tx.transactionType,
    value: tx.value,
    txHash: tx.hash,
    createdAt: tx.createdAt,
  }
}

type ParamList = {
  Detail: {
    asset: Asset;
  };
};

type State = {
  page: number,
  totalSupply: number,
  reward: number,
  transactions: CryptoTransaction[],
  contractAddress: string,
  paymentMethod: CryptoType,
}

// TODO
// v2 user!!`
const Detail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const asset = route.params.asset;
  const { currencyFormatter } = useContext(PreferenceContext);
  const { isWalletUser } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    page: 1,
    totalSupply: 0,
    reward: 0,
    transactions: [],
    contractAddress: '',
    paymentMethod: CryptoType.EL,
  })
  const [filter, setFilter] = useState<number>(0);
  const { elPrice, ethPrice } = usePrices();

  const laodV1OwnershipDetail = async () => {
    if (!asset.ownershipId) return;

    const res = await Server.ownershipDetail(asset.ownershipId)
    const txRes = await Server.getTransaction(asset.ownershipId, state.page)

    setState({
      page: 1,
      totalSupply: parseFloat(res.data.product.totalValue),
      reward: parseFloat(res.data.expectProfit),
      transactions: txRes.data.map((tx) => legacyTxToCryptoTx(tx)),
      contractAddress: res.data.product.contractAddress,
      paymentMethod: res.data.product.paymentMethod as CryptoType,
    })
  }

  const loadV1TxsMore = async () => {
    if (!asset.ownershipId) return;

    try {
      const txRes = await Server.getTransaction(asset.ownershipId, state.page);
      const nextTxs = txRes.data.map((tx) => legacyTxToCryptoTx(tx));

      if (nextTxs.length === 0) {
        alert(t('dashboard.last_transaction'))
        return
      }

      setState({
        ...state,
        page: state.page + 1,
        transactions: [...state.transactions, ...nextTxs]
      })
    } catch {
      alert(t('dashboard.last_transaction'))
    }
  }

  useEffect(() => {
    if (isWalletUser) {
      // v2User
    } else {
      laodV1OwnershipDetail();
    }
  }, [])

  const mainFeatures = [
    {
      title: '구매',
      icon: '+',
      handler: () => {
        navigation.navigate(AssetPage.Purchase, {
          fromCrypto: CryptoType.ETH,
          fromTitle: 'ETH',
          toCrypto: asset.type,
          toTitle: asset.title,
        })
      }
    },
    {
      title: '환불',
      icon: '−',
      handler: () => {
        navigation.navigate(AssetPage.Refund, {
          fromCrypto: asset.type,
          fromTitle: asset.title,
          toCrypto: CryptoType.ETH,
          toTitle: 'ETH',
        })
      }
    },
    {
      title: '이자',
      icon: '⤴',
      handler: () => {
        navigation.navigate(AssetPage.Reward, {
          toCrypto: CryptoType.ETH,
          toTitle: 'ETH',
        })
      }
    },
  ]

  return (
    <>
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: 'https://elysia.land/static/media/elysia-asset-6.033509fa.png' }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 293,
              resizeMode: 'cover',
            }}
          />
          <View style={{ position: 'absolute', padding: 20 }}>
            <BackButton handler={() => navigation.goBack()} />
          </View>
        </View>
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
          <H4Text
            style={{ marginTop: 20, color: AppColors.BLACK2 }}
            label={asset.unit + " " + t('main.assets')}
          />
          <TitleText
            style={{ marginTop: 10, color: AppColors.BLACK }}
            label={currencyFormatter(
              asset.currencyValue,
              2,
            )}
          />
          <View style={{ marginTop: 20, height: 1, backgroundColor: AppColors.GREY }} />
          {
            [
              { left: t('main.assets_name'), right: asset.title },
              { left: t('main.assets_value'), right: `${asset.unitValue} ${asset.unit}` },
              { left: t('main.assets_stake'), right: `${(asset.unitValue / state.totalSupply * 100).toFixed(2)}%` },
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
                    borderBottomColor: AppColors.GREY
                  }}
                >
                  <P1Text
                    style={{ color: AppColors.BLACK2 }}
                    label={data.left}
                  />
                  <H4Text
                    style={{ color: AppColors.BLACK }}
                    label={data.right}
                  />
                </View>
              )
            })
          }
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: AppColors.GREY
            }}
          >
            <H4Text
              style={{ color: AppColors.BLACK }}
              label={t('main.total_assets_yield')}
            />
            <View>
              <H4Text
                style={{ color: AppColors.MAIN, textAlign: 'right' }}
                label={currencyFormatter(
                  state.reward,
                  2,
                )}
              />
              <H4Text
                style={{ color: AppColors.BLACK2, textAlign: 'right' }}
                label={`${(state.reward / (state.paymentMethod === CryptoType.EL ? elPrice : ethPrice)).toFixed(2)} ${state.paymentMethod.toUpperCase()}`}
              />
            </View>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            {
              mainFeatures.map((data, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{ flexDirection: 'column', alignItems: 'center' }}
                    onPress={data.handler}
                  >
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: 27.5,
                        backgroundColor: AppColors.MAIN,
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: AppColors.WHITE,
                          fontSize: 27,
                          textAlign: 'center'
                        }}
                      >{data.icon}</Text>
                    </View>
                    <H4Text label={data.title} style={{ marginTop: 10 }} />
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
        <View style={{ height: 15, backgroundColor: AppColors.BACKGROUND_GREY }} />
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
          <H2Text label={t('main.transaction_list')} style={{ marginTop: 20 }} />
          <View style={{ height: 20 }} />
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
          />
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
              marginBottom: 15
            }}
            onPress={() => {
              if (isWalletUser) {

              } else {
                loadV1TxsMore()
              }
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
        </View>
      </ScrollView>
    </>
  );
};

export default Detail;

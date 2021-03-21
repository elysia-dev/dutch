import React, {
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../shared/components/BackButton';
import { H2Text, H4Text, P1Text, TitleText } from '../../shared/components/Texts';
import Asset from '../../types/Asset';
import SelectBox from './components/SelectBox';
import TransactionList from './components/TransactionList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import AppColors from '../../enums/AppColors';
import { AssetPage } from '../../enums/pageEnum';
import CryptoType from '../../enums/CryptoType';
import currencyFormatter from '../../utiles/currencyFormatter';
import CurrencyContext from '../../contexts/CurrencyContext';

const now = Date.now()

const testCryptoTx = [
  { type: 'in', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'out', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'in', value: '100', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now }
]

type ParamList = {
  Detail: {
    asset: Asset;
  };
};

// TODO
// 1. load 누적수익금
// 2. load 지분률
// 3. load txs...
// productId?
const Detail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const asset = route.params.asset;
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const [filter, setFilter] = useState<number>(0);

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
            label={asset.unit + " " + i18n.t('main.assets')}
          />
          <TitleText
            style={{ marginTop: 10, color: AppColors.BLACK }}
            label={currencyFormatter(
              currencyUnit,
              currencyRatio,
              asset.currencyValue,
              2,
            )}
          />
          <View style={{ marginTop: 20, height: 1, backgroundColor: AppColors.GREY }} />
          {
            [
              { left: i18n.t('main.assets_name'), right: asset.title },
              { left: i18n.t('main.assets_value'), right: `${asset.unitValue} ${asset.unit}` },
              { left: i18n.t('main.assets_stake'), right: '6.28%' },
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
              label={i18n.t('main.total_assets_yield')}
            />
            <View>
              <H4Text
                style={{ color: AppColors.MAIN, textAlign: 'right' }}
                label={'$ 5.1'}
              />
              <H4Text
                style={{ color: AppColors.BLACK2, textAlign: 'right' }}
                label={'0.123 ETH'}
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
          <H2Text label={i18n.t('main.transaction_list')} style={{ marginTop: 20 }} />
          <View style={{ height: 20 }} />
          <SelectBox
            options={['ALL', 'OUT', 'IN']}
            selected={filter}
            select={(filter) => setFilter(filter)}
          />
          <TransactionList data={testCryptoTx} unit={route.params.asset.unit} />
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
            }}>
            <P1Text
              style={{
                color: AppColors.MAIN,
                fontSize: 17,
                textAlign: 'center',
              }}
              label={i18n.t('dashboard_label.more_transactions')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default Detail;

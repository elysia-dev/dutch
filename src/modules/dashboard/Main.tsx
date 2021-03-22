import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView, View, Image, TouchableOpacity, RefreshControl
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { H3Text, TitleText } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetListing from './components/AssetListing';
import AppColors from '../../enums/AppColors';
import CryptoType from '../../enums/CryptoType';
import UserContext from '../../contexts/UserContext';
import { AssetPage, CryptoPage, MorePage, Page } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import ExpressoV2 from '../../api/ExpressoV2';
import WalletContext from '../../contexts/WalletContext';
import Asset from '../../types/Asset';
import usePrices from '../../hooks/usePrice';
import currencyFormatter from '../../utiles/currencyFormatter';
import CurrencyContext from '../../contexts/CurrencyContext';
import OverlayLoading from '../../shared/components/OverlayLoading';
import ProviderType from '../../enums/ProviderType';
import FunctionContext from '../../contexts/FunctionContext';

const defaultState = {
  assets: [
    { title: 'EL', currencyValue: 0, unitValue: 0, type: CryptoType.EL, unit: 'EL' },
    { title: 'ETH', currencyValue: 0, unitValue: 0, type: CryptoType.ETH, unit: 'ETH' },
  ],
  loading: true,
}

const symbolToCryptoType = (symbol: string): CryptoType => {
  if ([CryptoType.EL.toString(), CryptoType.ETH.toString()].includes(symbol)) {
    return symbol as CryptoType;
  } else {
    return CryptoType.ELA
  };
}

export const Main: React.FC = () => {
  const { user, isWalletUser, ownerships, balance } = useContext(UserContext);
  const { refreshUser } = useContext(FunctionContext)
  const { wallet } = useContext(WalletContext);
  const { elPrice, ethPrice } = usePrices();
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const [state, setState] = useState<{ assets: Asset[], loading: boolean }>(defaultState);
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const loadV2UserBalances = async () => {
    try {
      const { data } = await ExpressoV2.getBalances(wallet?.getFirstNode()?.address || '');

      setState({
        ...state,
        loading: false,
        assets: data.map((item) => {
          const price = item.symbol === CryptoType.ETH ? ethPrice : item.symbol === CryptoType.EL ? elPrice : 5
          return {
            title: item.name,
            currencyValue: item.balance * price,
            unitValue: item.balance,
            type: symbolToCryptoType(item.symbol),
            unit: item.symbol,
          }
        })
      })
    } catch {
      alert('Server Error');
      setState({
        ...state,
        loading: false
      })
    }
  }

  const loadV1UserBalances = async () => {
    const assets = ownerships.map((ownership) => {
      return {
        title: ownership.title,
        currencyValue: ownership.tokenValue * 5, // * asset token is 5usd
        unitValue: ownership.tokenValue,
        type: CryptoType.ELA,
        unit: CryptoType.ELA,
        ownerhipId: ownership.id,
        isLegacyOwnership: ownership.isLegacy
      } as Asset
    })

    let elBalance = 0;
    let ethBalance = 0;

    try {
      const { data } = await ExpressoV2.getBalances(user.ethAddresses[0] || '');

      elBalance = data.find((item) => item.symbol === CryptoType.EL)?.balance || 0;
      ethBalance = data.find((item) => item.symbol === CryptoType.ETH)?.balance || 0;
    } finally {
      assets.push({
        title: 'ETH',
        currencyValue: ethBalance,
        unitValue: ethBalance * ethPrice,
        type: CryptoType.ETH,
        unit: CryptoType.ETH
      })

      assets.push({
        title: 'EL',
        currencyValue: elBalance * elPrice,
        unitValue: elBalance,
        type: CryptoType.EL,
        unit: CryptoType.EL
      })

      setState({
        ...state,
        loading: false,
        assets: assets,
      })
    }
  }

  useEffect(() => {
    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        loading: false,
      })

      return
    };

    if (isWalletUser) {
      loadV2UserBalances()
    } else {
      // Below is not work.. maybe
      loadV1UserBalances()
    }
  }, [])

  const onRefresh = () => {
    if (user.provider === ProviderType.GUEST && !isWalletUser) return;

    setRefreshing(true);
    if (isWalletUser) {
      loadV2UserBalances().then(() => {
        setRefreshing(false)
      });
    } else {
      refreshUser().then(() => setRefreshing(false));
    }
  };

  return (
    <>
      <ScrollView
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
        }}
        refreshControl={
          user.provider !== ProviderType.GUEST || isWalletUser ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <BasicLayout >
          <H3Text
            style={{ marginTop: 50 }}
            label={i18n.t('main.total_assets')}
          />
          <View style={{
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
            marginTop: 15,
            marginBottom: 40,
          }}>
            {
              isWalletUser || user.ethAddresses[0] ? <TitleText
                label={currencyFormatter(
                  currencyUnit,
                  currencyRatio,
                  state.assets.reduce((res, cur) => res + cur.currencyValue, 0),
                  2
                )}
              /> :
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    navigation.navigate(Page.More, { screen: MorePage.RegisterEthAddress })
                  }}
                >
                  <View
                    style={{
                      shadowRadius: 3,
                      shadowColor: '#6F6F6F',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.4,
                    }}
                  >
                    <Image
                      style={{
                        height: 50,
                        width: 50,
                      }}
                      source={require('./images/newWallet.png')}
                    />
                  </View>
                  <TitleText
                    label={i18n.t('main.connect_wallet')}
                    style={{ height: 30, marginLeft: 20 }}
                  />
                  <View style={{
                    marginLeft: 'auto',
                    marginBottom: 5,
                  }}>
                    <Image
                      source={require('./images/bluedownarrow.png')}
                      style={{
                        width: 30,
                        height: 30,
                        transform: [{ rotate: '270deg' }],
                      }}
                    />
                  </View>
                </TouchableOpacity>
            }
          </View>
          <AssetListing
            title={i18n.t('main.my_assets')}
            assets={
              state.assets.filter((item) => {
                return ![CryptoType.EL, CryptoType.ETH].includes(item.type) && item.unitValue > 0
              })
            }
            itemPressHandler={(asset) => {
              navigation.navigate(Page.Asset, {
                screen: AssetPage.Detail,
                params: {
                  asset,
                }
              })
            }}
          />
          <View style={{ height: 25 }} />
          <AssetListing
            title={i18n.t('main.my_wallet')}
            assets={state.assets.filter((item) => [CryptoType.EL, CryptoType.ETH].includes(item.type))}
            itemPressHandler={(asset) => {
              navigation.navigate(
                Page.Crypto, {
                screen: CryptoPage.Detail,
                params: {
                  asset,
                }
              }
              );
            }}
          />
        </BasicLayout>
      </ScrollView>
      <OverlayLoading visible={state.loading} />
    </>
  );
};

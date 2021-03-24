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
import { AssetPage, CryptoPage, DashboardPage, MorePage, Page } from '../../enums/pageEnum';
import { useTranslation } from 'react-i18next';
import EspressoV2 from '../../api/EspressoV2';
import WalletContext from '../../contexts/WalletContext';
import Asset from '../../types/Asset';
import OverlayLoading from '../../shared/components/OverlayLoading';
import ProviderType from '../../enums/ProviderType';
import FunctionContext from '../../contexts/FunctionContext';
import PreferenceContext from '../../contexts/PreferenceContext';
import PriceContext from '../../contexts/PriceContext';
import LegacyRefundStatus from '../../enums/LegacyRefundStatus';
import LegacyWallet from './components/LegacyWallet';
import assetTokenNamePrettier from '../../utiles/assetTokenNamePrettier';

const defaultState = {
  assets: [
    { title: 'EL', currencyValue: 0, unitValue: 0, type: CryptoType.EL, unit: 'EL' },
    { title: 'ETH', currencyValue: 0, unitValue: 0, type: CryptoType.ETH, unit: 'ETH' },
  ],
  loading: true,
}

export const Main: React.FC = () => {
  const { user, isWalletUser, ownerships } = useContext(UserContext);
  const { refreshUser } = useContext(FunctionContext)
  const { wallet } = useContext(WalletContext);
  const { elPrice, ethPrice } = useContext(PriceContext);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const [state, setState] = useState<{ assets: Asset[], loading: boolean }>(defaultState);
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);

  const loadV2UserBalances = async (noCache?: boolean) => {
    try {
      const { data } = await EspressoV2.getBalances(wallet?.getFirstNode()?.address || '', noCache);

      const assets = data.tokens.filter((token) => ![CryptoType.ETH, CryptoType.EL, CryptoType.BNB].includes(token.symbol as CryptoType))
        .map((token) => {
          return {
            title: assetTokenNamePrettier(token.name),
            currencyValue: token.balance * 5,
            unitValue: token.balance,
            type: CryptoType.ELA,
            unit: token.symbol,
            address: token.address,
          } as Asset
        })

      const elBalance = data.tokens.find((token) => token.symbol === CryptoType.EL)?.balance || 0

      assets.push({
        title: 'Elysia',
        currencyValue: elBalance * elPrice,
        unitValue: elBalance,
        type: CryptoType.EL,
        unit: CryptoType.EL,
      });

      assets.push({
        title: 'ETH',
        currencyValue: data.ethBalance * ethPrice,
        unitValue: data.ethBalance,
        type: CryptoType.ETH,
        unit: CryptoType.ETH,
      })

      setState({
        ...state,
        loading: false,
        assets: assets,
      })
    } catch {
      alert('Server Error');
      setState({
        ...state,
        loading: false
      })
    }
  }

  const loadV1UserBalances = async (noCache?: boolean) => {
    const assets = ownerships.map((ownership) => {
      return {
        title: ownership.title,
        currencyValue: ownership.tokenValue * 5, // * asset token is 5usd
        unitValue: ownership.tokenValue,
        type: CryptoType.ELA,
        unit: CryptoType.ELA,
        ownershipId: ownership.id,
        isLegacyOwnership: ownership.isLegacy
      } as Asset
    })

    let elBalance = 0;
    let ethBalance = 0;

    try {
      const { data } = await EspressoV2.getBalances(user.ethAddresses[0] || '', noCache);

      elBalance = data.tokens.find((token) => token.symbol === CryptoType.EL)?.balance || 0;
      ethBalance = data.ethBalance || 0;

    } finally {
      assets.push({
        title: 'Elysia',
        currencyValue: elBalance * elPrice,
        unitValue: elBalance,
        type: CryptoType.EL,
        unit: CryptoType.EL
      })

      assets.push({
        title: 'ETH',
        currencyValue: ethBalance * ethPrice,
        unitValue: ethBalance,
        type: CryptoType.ETH,
        unit: CryptoType.ETH
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
      loadV2UserBalances(true).then(() => {
        setRefreshing(false)
      });
    } else {
      refreshUser().then(async () => {
        await loadV1UserBalances(true)
      }).finally(() => {
        setRefreshing(false)
      });
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
            label={t('main.total_assets')}
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
                    label={t('main.connect_wallet')}
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
            title={t('main.my_assets')}
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
            title={t('main.my_wallet')}
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
          {(user.legacyEl !== 0 || user.legacyUsd !== 0) &&
            [LegacyRefundStatus.NONE, LegacyRefundStatus.PENDING].includes(
              user.legacyWalletRefundStatus,
            ) && (
              <LegacyWallet
                balance={(user.legacyEl * elPrice + user.legacyUsd)}
                handler={() =>
                  navigation.navigate(Page.Dashboard, { screen: DashboardPage.RemainingBalance })
                }
              />
            )}
        </BasicLayout>
      </ScrollView>
      <OverlayLoading visible={state.loading} />
    </>
  );
};

import React, { useContext, useEffect } from 'react';
import {
  ScrollView, View, Image, TouchableOpacity, RefreshControl
} from 'react-native';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useIsFocused } from '@react-navigation/native';
import { H3Text, TitleText } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetListing from './components/AssetListing';
import AppColors from '../../enums/AppColors';
import CryptoType from '../../enums/CryptoType';
import UserContext from '../../contexts/UserContext';
import { AssetPage, CryptoPage, DashboardPage, MorePage, Page } from '../../enums/pageEnum';
import { useTranslation } from 'react-i18next';
import OverlayLoading from '../../shared/components/OverlayLoading';
import ProviderType from '../../enums/ProviderType';
import PreferenceContext from '../../contexts/PreferenceContext';
import PriceContext from '../../contexts/PriceContext';
import LegacyRefundStatus from '../../enums/LegacyRefundStatus';
import LegacyWallet from './components/LegacyWallet';
import AssetContext from '../../contexts/AssetContext';

type ParamList = {
  Main: {
    refresh: boolean,
  };
};

export const Main: React.FC = () => {
  const { user, isWalletUser, refreshUser } = useContext(UserContext);
  const { assets, assetLoaded, loadV2UserBalances, loadV1UserBalances } = useContext(AssetContext);
  const route = useRoute<RouteProp<ParamList, 'Main'>>()
  const { elPrice } = useContext(PriceContext);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = React.useState(false);

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

  useEffect(() => {
    if (isFocused) {
      if (route.params?.refresh) {
        navigation.setParams({ refresh: false })
        onRefresh();
      }
    }
  }, [isFocused])

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
            style={{ marginTop: 70 }}
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
              (isWalletUser || user.ethAddresses[0]) ? <TitleText
                label={currencyFormatter(
                  assets.reduce((res, cur) => res + cur.currencyValue, 0),
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
                    style={{ height: 30, marginLeft: 15 }}
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
              assets.filter((item) => {
                return item.type === CryptoType.ELA && item.unitValue > 0
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
            assets={assets.filter((item) => [CryptoType.EL, CryptoType.ETH, CryptoType.BNB].includes(item.type))}
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
      <OverlayLoading visible={!assetLoaded} />
    </>
  );
};

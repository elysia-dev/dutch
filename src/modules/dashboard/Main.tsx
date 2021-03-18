import React, { useContext } from 'react';
import {
  ScrollView, View, Image, TouchableOpacity
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { H3Text, TitleText } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetListing from './components/AssetListing';
import AppColors from '../../enums/AppColors';
import CryptoType from '../../enums/CryptoType';
import UserContext from '../../contexts/UserContext';
import { AssetPage, DashboardPage, MorePage, Page } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';

const testAssets = [
  { title: 'ASSET#2', currencyValue: '$ 2,000', unitValue: '4 EA2', type: CryptoType.ELA, unit: 'EA2' },
  { title: 'ASSET#3', currencyValue: '$ 3,000', unitValue: '6 EA3', type: CryptoType.ELA, unit: 'EA3' },
]

const testCurrencies = [
  { title: 'EL', currencyValue: '$ 15', unitValue: '300 EL', type: CryptoType.EL, unit: 'EL' },
  { title: 'ETH', currencyValue: '$ 223', unitValue: '0.1 ETH', type: CryptoType.ETH, unit: 'ETH' },
  { title: 'BNB', currencyValue: '$ 123', unitValue: '27 BNB', type: CryptoType.BNB, unit: 'BNB' },
]

export const Main: React.FC = () => {
  const { user, isWalletUser } = useContext(UserContext);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ScrollView
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}
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
              label={'$ 789,123'}
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
          assets={testAssets}
          itemPressHandler={(asset) => {
            navigation.navigate(Page.Asset, {
              screen: AssetPage.Detail,
              params: {
                asset,
              }
            })
          }}
          totalValue={'$ 789,123'}
        />
        <View style={{ height: 25 }} />
        <AssetListing
          title={i18n.t('main.my_wallet')}
          assets={testCurrencies}
          totalValue={'$ 50.23'}
          itemPressHandler={(asset) => {
            navigation.navigate(
              Page.Dashboard,
              {
                screen: DashboardPage.CryptoDetail,
                params: {
                  asset
                }
              }
            );
          }}
        />
      </BasicLayout>
    </ScrollView>
  );
};

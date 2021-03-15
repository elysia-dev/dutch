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
import { MorePage, Page } from '../../enums/pageEnum';

const testAssets = [
  { title: 'ASSET#2', currencyValue: '$ 2,000,000', unitValue: '4 EA1', type: CryptoType.ASSET },
  { title: 'ASSET#3', currencyValue: '$ 3,000,000', unitValue: '6 EA1', type: CryptoType.ASSET },
]

const testCurrencies = [
  { title: 'EL', currencyValue: '$ 15', unitValue: '300 EL', type: CryptoType.EL },
  { title: 'ETH', currencyValue: '$ 223', unitValue: '0.1 ETH', type: CryptoType.ETH },
  { title: 'BNB', currencyValue: '$ 123', unitValue: '27 BNB', type: CryptoType.BNB },
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
          label={'총 자산'}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: AppColors.GREY,
          marginTop: 15,
          marginBottom: 40,
        }}>
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
          {
            isWalletUser || user.ethAddresses[0] ? <TitleText
              style={{ marginLeft: 20 }}
              label={'$ 789,123,456,000'}
            /> :
              <TouchableOpacity
                style={{
                  marginLeft: 20,
                  flex: 1,
                  flexDirection: 'row',
                  height: 30,
                }}
                onPress={() => {
                  navigation.navigate(Page.More, { screen: MorePage.RegisterEthAddress })
                }}
              >
                <TitleText
                  label={'지갑을 연결해 주세요'}
                  style={{ height: 30 }}
                />
                <Image
                  source={require('./images/bluedownarrow.png')}
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: 0,
                    top: -2,
                    transform: [{ rotate: '270deg' }],
                  }}
                />
              </TouchableOpacity>
          }
        </View>
        <AssetListing
          title={'내 투자금'}
          assets={testAssets}
          totalValue={'$ 789,123,456,000'}
        />
        <View style={{ height: 25 }} />
        <AssetListing
          title={'내 지갑'}
          assets={testCurrencies}
          totalValue={'$ 50.23'}
        />
      </BasicLayout>
    </ScrollView>
  );
};

import React from 'react';
import {
  ScrollView, View, Image
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { H3Text, TitleText } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import AssetListing from './components/AssetListing';
import AppColors from '../../enums/AppColors';
import CurrencyIcon from '../../enums/CurrencyIcon';

const testAssets = [
  { title: 'ASSET#2', currencyValue: '$ 2,000,000', unitValue: '4 EA1', icon: CurrencyIcon.ASSET },
  { title: 'ASSET#3', currencyValue: '$ 3,000,000', unitValue: '6 EA1', icon: CurrencyIcon.ASSET },
]

const testCurrencies = [
  { title: 'EL', currencyValue: '$ 15', unitValue: '300 EL', icon: CurrencyIcon.EL },
  { title: 'ETH', currencyValue: '$ 223', unitValue: '0.1 ETH', icon: CurrencyIcon.ETH },
  { title: 'BNB', currencyValue: '$ 123', unitValue: '27 BNB', icon: CurrencyIcon.BNB },
]

export const Main: React.FC = () => {
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
          <TitleText
            label={'$ 789,123,456,000'}
            style={{ marginLeft: 20 }}
          />
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

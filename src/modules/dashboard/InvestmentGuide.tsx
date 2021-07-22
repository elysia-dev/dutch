import React, { FunctionComponent, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import investmentGuide1 from './images/investmentGuide1.png';
import investmentGuide2 from './images/investmentGuide2.png';
import investmentGuide3 from './images/investmentGuide3.png';
import investmentGuide4 from './images/investmentGuide4.png';
import { H2Text, P1Text } from '../../shared/components/Texts';
import QuitIcon from '../products/images/quitbutton.png';
import { useTranslation } from 'react-i18next';
import Circle from '../../shared/components/Circle';
import AppColors from '../../enums/AppColors';

const InvestmentGuide: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const [state, setState] = useState(0);
  const { t } = useTranslation();
  const viewPager = React.createRef<ViewPager>();
  const ReturnImage = (imgNumber: number) => {
    switch (imgNumber) {
      case 0:
        return investmentGuide1;
      case 1:
        return investmentGuide2;
      case 2:
        return investmentGuide3;
      default:
        return investmentGuide4;
    }
  };
  const ItemListing = Array(4)
    .fill(0)
    .map((_x, index) => {
      return (
        <View key={index}>
          <Image
            source={ReturnImage(index)}
            style={{
              width: '90%',
              marginTop: '10%',
              marginRight: '5%',
              marginBottom: 30,
              marginLeft: '5%',
              position: 'absolute',
            }}
          />
          <View style={{ marginTop: 'auto', marginBottom: '35%' }}>
            <H2Text
              label={t('dashboard.investment_guide_header.' + index)}
              style={{ fontSize: 25, textAlign: 'center' }}
            />
            <P1Text
              label={t('dashboard.investment_guide_text.' + index)}
              style={{ marginTop: 20, textAlign: 'center' }}
            />
          </View>
        </View>
      );
    });
  const ButtonListing = Array(4)
    .fill(0)
    .map((_x, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            viewPager.current?.setPage(index);
          }}
          key={index}>
          <Circle
            style={{
              backgroundColor: state === index ? '#3679B5' : '#BDD3E6',
              overflow: 'hidden',
              margin: 10,
            }}
          />
        </TouchableOpacity>
      );
    });
  return (
    <View style={{ flex: 1, backgroundColor: AppColors.WHITE, paddingTop: 55 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginLeft: 'auto',
          marginRight: '5%',
        }}>
        <Image source={QuitIcon} />
      </TouchableOpacity>
      <ViewPager
        style={{ flex: 1 }}
        initialPage={0}
        ref={viewPager}
        onPageSelected={(e) => {
          setState(e.nativeEvent.position);
        }}>
        {ItemListing}
      </ViewPager>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          bottom: '20%',
        }}>
        {ButtonListing}
      </View>
    </View>
  );
};

export default InvestmentGuide;

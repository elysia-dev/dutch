import React, { useState } from 'react';
import {
  SafeAreaView,
  Animated,
  View,
  Text,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../enums/AppColors';
import AnimatedMainHeader from '../../shared/components/AnimatedMainHeader';
import AppFonts from '../../enums/AppFonts';
import { Page, StakingPage } from '../../enums/pageEnum';
import CryptoType from '../../enums/CryptoType';
import TouchableCardWithShadow from './components/TouchableCardWithShadow';
import { STAKING_POOL_ROUNDS, NUMBER_OF_ROUNDS } from '../../constants/staking';

export const Main: React.FC = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { t } = useTranslation();
  const totalStakingPeriod = `${STAKING_POOL_ROUNDS[0].startedAt.format(
    t('datetime_format'),
  )} ~ ${STAKING_POOL_ROUNDS[NUMBER_OF_ROUNDS - 1].endedAt.format(
    t('datetime_format'),
  )} (KST)`;

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: AppColors.WHITE,
      }}>
      <AnimatedMainHeader title={t('staking.staking')} scrollY={scrollY} />
      <ScrollView alwaysBounceVertical={true}>
        <View
          style={{
            marginTop: 45,
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <TouchableCardWithShadow
            style={{
              width: '100%',
              height: 180,
              marginBottom: 30,
            }}
            onPress={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.CurrentDashboard,
                params: {
                  cryptoType: CryptoType.EL,
                  rewardCryptoType: CryptoType.ELFI,
                },
              });
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('./images/el_staking_visualization.png')}
                width={304}
              />
            </View>
            <View
              style={{
                height: 65,
                borderTopWidth: 1,
                borderTopColor: AppColors.GREY,
                padding: 16,
              }}>
              <Text
                style={{
                  color: AppColors.BLACK,
                  fontSize: 15,
                  lineHeight: 17,
                  fontFamily: AppFonts.Bold,
                }}>
                {t('staking.staking_with_type', {
                  stakingCrypto: CryptoType.EL,
                })}
              </Text>
              <Text
                style={{
                  color: AppColors.BLACK,
                  fontSize: 10,
                  lineHeight: Platform.OS === 'ios' ? 24 : 20,
                  fontFamily: AppFonts.Regular,
                }}>
                {`${t('staking.schedule')} : ${totalStakingPeriod}`}
              </Text>
            </View>
          </TouchableCardWithShadow>
          <TouchableCardWithShadow
            style={{
              width: '100%',
              height: 180,
              marginBottom: 30,
            }}
            onPress={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.CurrentDashboard,
                params: {
                  cryptoType: CryptoType.ELFI,
                  rewardCryptoType: CryptoType.DAI,
                },
              });
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('./images/elfi_staking_visualization.png')}
                width={304}
              />
            </View>
            <View
              style={{
                height: 65,
                borderTopWidth: 1,
                borderTopColor: AppColors.GREY,
                padding: 16,
              }}>
              <Text
                style={{
                  color: AppColors.BLACK,
                  fontSize: 15,
                  lineHeight: 17,
                  fontFamily: AppFonts.Bold,
                }}>
                {t('staking.staking_with_type', {
                  stakingCrypto: CryptoType.ELFI,
                })}
              </Text>
              <Text
                style={{
                  color: AppColors.BLACK,
                  fontSize: 10,
                  lineHeight: Platform.OS === 'ios' ? 24 : 20,
                  fontFamily: AppFonts.Regular,
                }}>
                {`${t('staking.schedule')} : ${totalStakingPeriod}`}
              </Text>
            </View>
          </TouchableCardWithShadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

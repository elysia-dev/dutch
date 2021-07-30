import React, { useState } from 'react';
import { SafeAreaView, Animated, View, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../enums/AppColors';
import AnimatedMainHeader from '../../shared/components/AnimatedMainHeader';
import AppFonts from '../../enums/AppFonts';
import { Page, StakingPage } from '../../enums/pageEnum';
import CryptoType from '../../enums/CryptoType';
import TouchableCardWithShadow from './components/TouchableCardWithShadow';

export const Main: React.FC = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const currentCycle = 3; // dummy data

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: AppColors.WHITE,
      }}>
      <AnimatedMainHeader title={'스테이킹'} scrollY={scrollY} />
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
                currentCycle,
              },
            });
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>img</Text>
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
              EL 스테이킹
            </Text>
            <Text
              style={{
                color: AppColors.BLACK,
                fontSize: 10,
                lineHeight: Platform.OS === 'ios' ? 24 : 20,
                fontFamily: AppFonts.Regular,
              }}>
              기간 : 2021.07.26 19:00:00 ~ 2021.08.26 19:00:00 (KST)
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
                currentCycle,
              },
            });
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>img</Text>
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
              ELFI 스테이킹
            </Text>
            <Text
              style={{
                color: AppColors.BLACK,
                fontSize: 10,
                lineHeight: Platform.OS === 'ios' ? 24 : 20,
                fontFamily: AppFonts.Regular,
              }}>
              기간 : 2021.07.26 19:00:00 ~ 2021.08.26 19:00:00 (KST)
            </Text>
          </View>
        </TouchableCardWithShadow>
      </View>
    </SafeAreaView>
  );
};

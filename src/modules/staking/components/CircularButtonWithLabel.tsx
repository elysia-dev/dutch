import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';
import { Page, StakingPage } from '../../../enums/pageEnum';
import CryptoType from '../../../enums/CryptoType';

const CircularButtonWithLabel: React.FC<{
  cryptoType: CryptoType;
  isActive: boolean;
  actionType: 'staking' | 'unstaking' | 'reward';
}> = ({ cryptoType, isActive, actionType }) => {
  const navigation = useNavigation();

  let source;
  let label;
  let screen: StakingPage;
  switch (actionType) {
    case 'staking':
      if (isActive) {
        source = require('../images/staking_button.png');
      } else {
        source = require('../images/staking_button_deactivated.png');
      }
      label = '스테이킹';
      screen = StakingPage.Stake;
      break;
    case 'unstaking':
      if (isActive) {
        source = require('../images/unstaking_button.png');
      } else {
        source = require('../images/unstaking_button_deactivated.png');
      }
      label = '언스테이킹';
      screen = StakingPage.Unstake;
      break;
    case 'reward':
      if (isActive) {
        source = require('../images/reward_button.png');
      } else {
        source = require('../images/reward_button_deactivated.png');
      }
      label = '보상 수령';
      // screen = StakingPage.Stake;
      break;
    default:
      break;
  }

  return (
    <View>
      <TouchableOpacity
        disabled={!isActive}
        onPress={() => {
          navigation.navigate(Page.Staking, {
            screen,
            params: { cryptoType },
          });
        }}>
        <Image
          source={source}
          style={{
            width: isActive ? 72 : 54,
            height: isActive ? 72 : 54,
            margin: isActive ? 0 : 9,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: AppFonts.Medium,
          fontSize: 13,
          color: isActive ? AppColors.BLACK : AppColors.BLUE_2,
        }}>
        {label}
      </Text>
    </View>
  );
};

export default CircularButtonWithLabel;

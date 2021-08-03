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
  selectedRound: number;
  currentRound?: number;
  isRewardAvailable?: boolean;
  isMigrationAvailable?: boolean;
}> = ({
  cryptoType,
  isActive,
  actionType,
  selectedRound,
  currentRound,
  isRewardAvailable,
  isMigrationAvailable,
}) => {
  const navigation = useNavigation();

  let source;
  let label;
  let screen: StakingPage;
  let pageAfterSelection: StakingPage;
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
      if (isRewardAvailable) {
        screen = StakingPage.SelectUnstakingType;
        if (isMigrationAvailable) {
          pageAfterSelection = StakingPage.UnstakeAndMigrate;
        } else {
          pageAfterSelection = StakingPage.Unstake;
        }
      } else {
        screen = StakingPage.Unstake;
      }
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
            params: {
              cryptoType,
              selectedRound,
              currentRound,
              pageAfterSelection,
            },
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
          textAlign: 'center',
          marginTop: 4,
        }}>
        {label}
      </Text>
    </View>
  );
};

export default CircularButtonWithLabel;

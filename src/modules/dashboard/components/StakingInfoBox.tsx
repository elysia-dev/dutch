import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../../enums/AppColors';
import { Page, StakingPage } from '../../../enums/pageEnum';

const StakingInfoBox: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: AppColors.GREY,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
      }}
      onPress={() => {
        navigation.navigate(Page.Staking, {
          screen: StakingPage.TotalDashboard,
          // params: { type },
        });
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, color: AppColors.SUB_BLACK }}>
          1차 스테이킹
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 12, color: AppColors.BLACK }}>
            1,000,000 EL
          </Text>
          <Text style={{ fontSize: 10, color: AppColors.SUB_BLACK }}>
            (=$5,000,000)
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
        <Text style={{ fontSize: 12, color: AppColors.SUB_BLACK }}>
          1차 리워드
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 12, color: AppColors.BLACK }}>500 ELFI</Text>
          <Text style={{ fontSize: 10, color: AppColors.SUB_BLACK }}>
            (=$500,000)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StakingInfoBox;

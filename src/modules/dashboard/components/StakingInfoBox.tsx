import React, { useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../../enums/AppColors';
import { Page, StakingPage } from '../../../enums/pageEnum';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';

const StakingInfoBox: React.FC<{
  cryptoType: CryptoType;
  round: number;
  stakingAmount: number;
  rewardAmount: number;
}> = ({ cryptoType, round, stakingAmount, rewardAmount }) => {
  const navigation = useNavigation();
  const { getCryptoPrice } = useContext(PriceContext);
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: AppColors.GREY,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 10,
      }}
      onPress={() => {
        navigation.navigate(Page.Staking, {
          screen: StakingPage.TotalDashboard,
          params: { cryptoType, round },
        });
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 12,
            color: AppColors.SUB_BLACK,
            fontFamily: AppFonts.Regular,
          }}>
          {`${round}차 스테이킹`}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Medium,
            }}>
            {`${commaFormatter(stakingAmount)} ${cryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= $ ${commaFormatter(
              stakingAmount * getCryptoPrice(cryptoType),
            )})`}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: AppColors.SUB_BLACK,
            fontFamily: AppFonts.Regular,
          }}>
          {`${round}차 리워드`}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Medium,
            }}>
            {`${commaFormatter(rewardAmount)} ${rewardCryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= $ ${commaFormatter(
              rewardAmount * getCryptoPrice(rewardCryptoType),
            )})`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StakingInfoBox;

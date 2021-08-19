import React, { useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { Page, StakingPage } from '../../../enums/pageEnum';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';
import decimalFormatter from '../../../utiles/decimalFormatter';

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
  const { t } = useTranslation();

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
          params: { cryptoType, round, stakingAmount, rewardAmount },
        });
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 12,
            color: AppColors.SUB_BLACK,
            fontFamily: AppFonts.Regular,
          }}>
          {t('main.staking_amount', { round })}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Medium,
            }}>
            {`${commaFormatter(
              decimalFormatter(stakingAmount, 5),
            )} ${cryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= $ ${commaFormatter(
              decimalFormatter(stakingAmount * getCryptoPrice(cryptoType), 5),
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
          {t('main.reward_amount', { round })}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Medium,
            }}>
            {`${commaFormatter(
              decimalFormatter(rewardAmount, 5),
            )} ${rewardCryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= $ ${commaFormatter(
              decimalFormatter(
                rewardAmount * getCryptoPrice(rewardCryptoType),
                5,
              ),
            )})`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StakingInfoBox;

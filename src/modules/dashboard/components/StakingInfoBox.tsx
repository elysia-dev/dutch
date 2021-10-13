import React, { useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BigNumber, utils } from 'ethers';
import AppColors from '../../../enums/AppColors';
import { Page, StakingPage } from '../../../enums/pageEnum';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';
import decimalFormatter from '../../../utiles/decimalFormatter';
import PreferenceContext from '../../../contexts/PreferenceContext';

const StakingInfoBox: React.FC<{
  cryptoType: CryptoType;
  round: number;
  stakingAmount: BigNumber;
  rewardAmount: BigNumber;
}> = ({ cryptoType, round, stakingAmount, rewardAmount }) => {
  const navigation = useNavigation();
  const { getCryptoPrice } = useContext(PriceContext);
  const { currencyFormatter } = useContext(PreferenceContext);
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
              decimalFormatter(Number(utils.formatEther(stakingAmount)), 2),
            )} ${cryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {/* {`(= $ ${commaFormatter(
              decimalFormatter(
                Number(utils.formatEther(stakingAmount)) *
                  getCryptoPrice(cryptoType),
                2,
              ),
            )})`} */}
            {`(= ${currencyFormatter(
              Number(utils.formatEther(stakingAmount)) *
                getCryptoPrice(cryptoType),
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
              decimalFormatter(Number(utils.formatEther(rewardAmount)), 2),
            )} ${rewardCryptoType} `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= ${currencyFormatter(
              Number(utils.formatEther(rewardAmount)) *
                getCryptoPrice(rewardCryptoType),
            )})`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StakingInfoBox;

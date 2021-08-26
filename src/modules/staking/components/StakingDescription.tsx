import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import CryptoType from '../../../enums/CryptoType';
import { P3Text, TitleText } from '../../../shared/components/Texts';
import el_staking_visualization from '../images/el_staking_visualization.png';
import elfi_staking_visualization from '../images/elfi_staking_visualization.png';

type props = {
  stakingCrypto: CryptoType;
  rewardCrypto: CryptoType;
};

const StakingDescription: React.FC<props> = ({
  stakingCrypto,
  rewardCrypto,
}) => {
  const { t } = useTranslation();
  return (
    <View>
      <TitleText
        label={t('staking.staking_description', { stakingCrypto })}
        style={{ fontSize: 22 }}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 20,
          paddingTop: 20,
          paddingLeft: 17,
          paddingRight: 17,
          marginTop: 12,
          marginBottom: 61,
          borderRadius: 5,
          borderColor: AppColors.SUB_GREY,
          borderWidth: 1,
        }}>
        {stakingCrypto === CryptoType.EL ? (
          <Image source={el_staking_visualization} width={294} height={84} />
        ) : (
          <Image source={elfi_staking_visualization} width={294} height={84} />
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 38,
          }}>
          <View
            style={{
              width: 4.2,
              height: 4.2,
              backgroundColor: AppColors.BLACK2,
              borderRadius: 4.2,
              marginTop: 5.5,
              marginRight: 13,
            }}
          />
          <P3Text
            label={t('staking.staking_description_first', {
              stakingCrypto,
              rewardCrypto,
            })}
            style={{ color: AppColors.BLACK, width: 275 }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <View
            style={{
              width: 4.2,
              height: 4.2,
              backgroundColor: AppColors.BLACK2,
              borderRadius: 4.2,
              marginTop: 5.5,
              marginRight: 13,
            }}
          />
          <P3Text
            label={t('staking.staking_description_second', {
              stakingCrypto,
              rewardCrypto,
            })}
            style={{ color: AppColors.BLACK, width: 275 }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <View
            style={{
              width: 4.2,
              height: 4.2,
              backgroundColor: AppColors.BLACK2,
              borderRadius: 4.2,
              marginTop: 5.5,
              marginRight: 13,
            }}
          />
          <P3Text
            label={t('staking.staking_description_third')}
            style={{ color: AppColors.BLACK, width: 275 }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <View
            style={{
              width: 4.2,
              height: 4.2,
              backgroundColor: AppColors.BLACK2,
              borderRadius: 4.2,
              marginTop: 5.5,
              marginRight: 13,
            }}
          />
          <P3Text
            label={t('staking.staking_description_fourth', {
              stakingCrypto,
              rewardCrypto,
            })}
            style={{ color: AppColors.BLACK, width: 275 }}
          />
        </View>
      </View>
    </View>
  );
};

export default StakingDescription;

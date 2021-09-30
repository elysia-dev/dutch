import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text, P2Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingListingSkeleton from './StakingListingSkeleton';
import AppFonts from '../../../enums/AppFonts';
import useUserAsset from '../../../hooks/useUserAsset';
import useUserAddress from '../../../hooks/useUserAddress';
import commaFormatter from '../../../utiles/commaFormatter';
import decimalFormatter from '../../../utiles/decimalFormatter';

const StakingListing: React.FC<{
  elStakingInfoBoxes: React.ReactNode[];
  elfiStakingInfoBoxes: React.ReactNode[];
  hasAnyInfoBoxes: { EL: boolean; ELFI: boolean };
  stakingLoaded: boolean;
}> = ({
  elStakingInfoBoxes,
  elfiStakingInfoBoxes,
  hasAnyInfoBoxes,
  stakingLoaded,
}) => {
  const { t } = useTranslation();
  const userAddress = useUserAddress();
  const { totalPrincipal, totalReward } = useUserAsset(userAddress!);

  if (stakingLoaded) {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: AppColors.GREY,
          paddingBottom: 12,
          marginTop: 12,
          marginBottom: 10,
        }}>
        <View
          style={{
            paddingBottom: 15,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <H3Text label={t('main.my_staking')} />
          <H3Text
            label={`$ ${commaFormatter(
              decimalFormatter(totalPrincipal + totalReward, 2),
            )}`}
          />
        </View>
        {hasAnyInfoBoxes.EL && (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: 60,
                paddingTop: 5,
                paddingBottom: 5,
                alignItems: 'center',
              }}>
              <CryptoImage type={CryptoType.EL} />
              <CryptoImage
                type={CryptoType.ELFI}
                style={{
                  width: 25,
                  height: 25,
                  position: 'absolute',
                  bottom: 5,
                  left: 20,
                }}
              />
              <P1Text
                label={t('main.staking_by_crypto', {
                  stakingCrypto: CryptoType.EL,
                  rewardCrypto: CryptoType.ELFI,
                })}
                style={{ marginLeft: 15, fontFamily: AppFonts.Medium }}
              />
            </View>
            <View style={{ marginTop: 8 }}>{elStakingInfoBoxes}</View>
          </>
        )}
        {hasAnyInfoBoxes.ELFI && (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: 60,
                paddingTop: 5,
                paddingBottom: 5,
                alignItems: 'center',
              }}>
              <CryptoImage type={CryptoType.ELFI} />
              <CryptoImage
                type={CryptoType.DAI}
                style={{
                  width: 25,
                  height: 25,
                  position: 'absolute',
                  bottom: 5,
                  left: 20,
                }}
              />
              <P1Text
                label={t('main.staking_by_crypto', {
                  stakingCrypto: CryptoType.ELFI,
                  rewardCrypto: CryptoType.DAI,
                })}
                style={{ marginLeft: 15, fontFamily: AppFonts.Medium }}
              />
            </View>
            <View style={{ marginTop: 8 }}>{elfiStakingInfoBoxes}</View>
          </>
        )}
        {!hasAnyInfoBoxes.EL && !hasAnyInfoBoxes.ELFI && (
          <View
            style={{
              height: 100,
            }}>
            <P2Text
              style={{ textAlign: 'center', marginTop: 40 }}
              label={t('staking.no_history')}
            />
          </View>
        )}
      </View>
    );
  } else {
    return <StakingListingSkeleton />;
  }
};

export default StakingListing;

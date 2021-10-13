import React, { useContext } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text, P2Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingListingSkeleton from './StakingListingSkeleton';
import AppFonts from '../../../enums/AppFonts';
import useUserAsset from '../../../hooks/useUserAsset';
import StakingContext from '../../../contexts/StakingContext';
import StakingInfoBox from './StakingInfoBox';
import { NUMBER_OF_ROUNDS } from '../../../constants/staking';
import range from '../../../utiles/range';
import PreferenceContext from '../../../contexts/PreferenceContext';

const StakingListing: React.FC = () => {
  const { t } = useTranslation();
  const { totalPrincipal, totalReward } = useUserAsset();
  const stakingRounds = range(1, NUMBER_OF_ROUNDS, 1);
  const {
    elStakingList,
    elfiStakingList,
    elStakingRewards,
    elfiStakingRewards,
    stakingLoaded,
  } = useContext(StakingContext);
  const { currencyFormatter } = useContext(PreferenceContext);

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
          <H3Text label={currencyFormatter(totalPrincipal + totalReward)} />
        </View>
        {elStakingRewards.some((reward) => !reward.isZero()) && (
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
            <View style={{ marginTop: 8 }}>
              {stakingRounds.map((round) => {
                if (!elStakingList[round - 1]) return;
                const stakingAmount = elStakingList[round - 1].userPrincipal;
                const rewardAmount = elStakingRewards[round - 1];

                if (!stakingAmount.isZero() || !rewardAmount.isZero()) {
                  return (
                    <StakingInfoBox
                      key={round}
                      cryptoType={CryptoType.EL}
                      round={round}
                      stakingAmount={stakingAmount}
                      rewardAmount={rewardAmount}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </View>
          </>
        )}
        {elfiStakingRewards.some((reward) => !reward.isZero()) && (
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
            <View style={{ marginTop: 8 }}>
              {stakingRounds.map((round) => {
                if (!elfiStakingList[round - 1]) return;
                const stakingAmount = elfiStakingList[round - 1].userPrincipal;
                const rewardAmount = elfiStakingRewards[round - 1];

                if (!stakingAmount.isZero() || !rewardAmount.isZero()) {
                  return (
                    <StakingInfoBox
                      key={round}
                      cryptoType={CryptoType.ELFI}
                      round={round}
                      stakingAmount={stakingAmount}
                      rewardAmount={rewardAmount}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </View>
          </>
        )}
        {![...elStakingRewards, ...elfiStakingRewards].some(
          (reward) => !reward.isZero(),
        ) && (
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

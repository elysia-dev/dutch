import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../enums/AppColors';
import CryptoImage from '../../shared/components/CryptoImage';
import SheetHeader from '../../shared/components/SheetHeader';
import TouchableCardWithShadow from './components/TouchableCardWithShadow';
import CryptoType from '../../enums/CryptoType';
import { P1Text, P4Text } from '../../shared/components/Texts';
import AppFonts from '../../enums/AppFonts';
import { Page, StakingPage } from '../../enums/pageEnum';

const SelectUnstakingType: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, pageAfterSelection, selectedRound, currentRound } =
    route.params;
  const navigation = useNavigation();
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={t('staking.')} />
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <TouchableCardWithShadow
          onPress={() => {
            navigation.navigate(Page.Staking, {
              screen: pageAfterSelection,
              params: {
                cryptoType,
                selectedRound,
                currentRound,
                earnReward: true,
              },
            });
          }}
          style={{
            height: 100,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View>
              <P4Text
                label={t('staking.unstake_with_reward_subtitle')}
                style={{ color: AppColors.BLACK, lineHeight: 20 }}
              />
              <P1Text
                label={t('staking.unstake_with_reward', {
                  rewardCrypto: rewardCryptoType,
                  stakingCrypto: cryptoType,
                })}
                style={{ fontFamily: AppFonts.Bold }}
              />
            </View>
            <CryptoImage
              type={cryptoType}
              style={{
                position: 'absolute',
                right: 28,
                zIndex: 2,
              }}
            />
            <CryptoImage type={rewardCryptoType} />
          </View>
        </TouchableCardWithShadow>
        <TouchableCardWithShadow
          onPress={() => {
            navigation.navigate(Page.Staking, {
              screen: StakingPage.Unstake,
              params: {
                cryptoType,
                selectedRound,
                currentRound,
                earnReward: false,
              },
            });
          }}
          style={{
            height: 100,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View>
              <P4Text
                label={t('staking.unstake_only_subtitle', {
                  rewardCrypto: rewardCryptoType,
                })}
                style={{ color: AppColors.BLACK, lineHeight: 20 }}
              />
              <P1Text
                label={t('staking.unstake_only', { stakingCrypto: cryptoType })}
                style={{ fontFamily: AppFonts.Bold }}
              />
            </View>
            <CryptoImage type={cryptoType} />
          </View>
        </TouchableCardWithShadow>
      </View>
    </View>
  );
};

export default SelectUnstakingType;

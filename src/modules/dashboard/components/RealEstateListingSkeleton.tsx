import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text } from '../../../shared/components/Texts';
import Skeleton from '../../../shared/components/Skeleton';
import StakingInfoBoxSkeleton from './StakingInfoBoxSkeleton';

const RealEstateListingSkeleton: React.FC = () => {
  const { t } = useTranslation();

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
        <H3Text label={t('main.my_assets')} />
        <Skeleton width={90} height={20} radius={5} />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          alignItems: 'center',
        }}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={{ width: 16 }} />
        <Skeleton width={160} height={17} radius={2} />
      </View>
      <View style={{ marginTop: 8 }} />
      <StakingInfoBoxSkeleton />
    </View>
  );
};

export default RealEstateListingSkeleton;

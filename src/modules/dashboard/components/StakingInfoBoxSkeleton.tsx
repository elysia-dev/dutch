import React from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import Skeleton from '../../../shared/components/Skeleton';

const StakingInfoBoxSkeleton: React.FC = () => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: AppColors.GREY,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 10,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Skeleton width={65} height={15} radius={2} />
        <Skeleton width={138} height={15} radius={2} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
        <Skeleton width={65} height={15} radius={2} />
        <Skeleton width={138} height={15} radius={2} />
      </View>
    </View>
  );
};

export default StakingInfoBoxSkeleton;

import React from 'react';
import { View } from 'react-native';
import Skeleton from '../../../shared/components/Skeleton';
import AppColors from '../../../enums/AppColors';

const TransactionItemSkeleton: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: AppColors.GREY,
        borderBottomWidth: 1,
        paddingVertical: 20,
        alignItems: 'center',
      }}>
      <View style={{ width: 10 }} />
      <Skeleton width={20} height={20} radius={10} />
      <View style={{ marginLeft: 10 }}>
        <Skeleton width={70} height={15} radius={2} />
        <Skeleton width={110} height={13} radius={2} />
      </View>
      <View style={{ marginLeft: 'auto' }} />
      <Skeleton width={50} height={18} radius={2} />
    </View>
  );
};

export default TransactionItemSkeleton;

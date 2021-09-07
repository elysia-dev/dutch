import React from 'react';
import { View } from 'react-native';
import Skeleton from '../../../shared/components/Skeleton';

const AssetItemSkeleton: React.FC = () => {
  return (
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
      <View style={{ marginLeft: 15 }}>
        <Skeleton width={102} height={17} radius={2} />
        <Skeleton width={45} height={15} radius={2} />
      </View>
      <View style={{ marginLeft: 'auto' }} />
      <Skeleton width={88} height={19} radius={2} />
    </View>
  );
};

export default AssetItemSkeleton;

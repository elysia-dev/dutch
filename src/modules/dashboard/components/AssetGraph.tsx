import React from 'react';
import { View } from 'react-native';
import { P2Text } from '../../../shared/components/Texts';

interface IAssetGraph {
  data: string[],
}

const AssetGraph: React.FC<IAssetGraph> = ({
  data,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 200,
        alignItems: 'center'
      }}
    >
      {
        data.length === 0 && <P2Text label={'거래내역이 없습니다.'} style={{ textAlign: 'center', width: '100%' }} />
      }
    </View >
  );
};

export default AssetGraph

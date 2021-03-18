import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CryptoType from '../../../enums/CryptoType';
import CryptoImage from '../../../shared/components/CryptoImage';
import { P1Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';

interface IAssetItem {
  asset: Asset,
  onPress?: (asset: Asset) => void,
  touchable?: boolean,
}

export const AssetItem: React.FC<IAssetItem> = ({
  asset,
  onPress = () => { },
  touchable = true,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(asset)}
      disabled={!touchable}
      style={{ display: 'flex', flexDirection: 'row', height: 60, paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}
    >
      <CryptoImage type={asset.type} />
      <View style={{ marginLeft: 15 }}>
        <P1Text label={asset.title} />
        <P2Text label={asset.unitValue} />
      </View>
      <P1Text
        style={{ marginLeft: 'auto' }}
        label={asset.currencyValue}
      />
    </TouchableOpacity>
  );
};

export default AssetItem

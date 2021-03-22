import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PreferenceContext from '../../../contexts/PreferenceContext';
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
  const { currencyFormatter } = useContext(PreferenceContext)

  return (
    <TouchableOpacity
      onPress={() => onPress(asset)}
      disabled={!touchable}
      style={{ display: 'flex', flexDirection: 'row', height: 60, paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}
    >
      <CryptoImage type={asset.type} />
      <View style={{ marginLeft: 15 }}>
        <P1Text label={asset.title} />
        <P2Text label={`${asset.unitValue.toFixed(2)} ${asset.unit}`} />
      </View>
      <P1Text
        style={{ marginLeft: 'auto' }}
        label={currencyFormatter(
          asset.currencyValue,
          2
        )}
      />
    </TouchableOpacity>
  );
};

export default AssetItem

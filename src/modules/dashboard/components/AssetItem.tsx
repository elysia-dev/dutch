import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CryptoType from '../../../enums/CryptoType';
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
      <Image
        source={
          asset.type === CryptoType.EL ?
            require('../images/el.png') :
            asset.type === CryptoType.ETH ?
              require('../images/eth.png') :
              asset.type === CryptoType.BNB ?
                require('../images/bnb.png') :
                require('../images/asset.png')
        }
        style={{
          width: 40,
          height: 40
        }}
      />
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

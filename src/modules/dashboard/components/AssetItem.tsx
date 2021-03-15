import React from 'react';
import { View, Image } from 'react-native';
import CryptoType from '../../../enums/CryptoType';
import { P1Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';

export const AssetItem: React.FC<Asset> = ({
  type,
  title,
  currencyValue,
  unitValue,
}) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', height: 50, paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
      <Image
        source={
          type === CryptoType.EL ?
            require('../images/el.png') :
            type === CryptoType.ETH ?
              require('../images/eth.png') :
              type === CryptoType.BNB ?
                require('../images/bnb.png') :
                require('../images/asset.png')
        }
        style={{
          width: 40,
          height: 40
        }}
      />
      <View style={{ marginLeft: 15 }}>
        <P1Text label={title} />
        <P2Text label={unitValue} />
      </View>
      <P1Text
        style={{ marginLeft: 'auto' }}
        label={currencyValue}
      />
    </View>
  );
};

export default AssetItem

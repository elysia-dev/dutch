import React from 'react';
import { View, Image } from 'react-native';
import CurrencyIcon from '../../../enums/CurrencyIcon';
import { P1Text, P2Text } from '../../../shared/components/Texts';

interface IAssetItem {
  icon: CurrencyIcon
  title: string
  currencyValue: string
  unitValue: string
}

export const AssetItem: React.FC<IAssetItem> = ({
  icon,
  title,
  currencyValue,
  unitValue,
}) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', height: 50, paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
      <Image
        source={
          icon === CurrencyIcon.EL ?
            require('../images/el.png') :
            icon === CurrencyIcon.ETH ?
              require('../images/eth.png') :
              icon === CurrencyIcon.BNB ?
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

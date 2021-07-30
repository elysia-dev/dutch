import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import CryptoType from '../../enums/CryptoType';
import PaymentCryptoType from '../../enums/PaymentCryptoType';
import CachedImage from './CachedImage';

const CryptoImage: React.FC<{
  type: CryptoType | PaymentCryptoType | string;
  style?: StyleProp<ImageStyle>;
}> = ({ type, style }) => {
  const SwitchIcon = (type: CryptoType | PaymentCryptoType | string) => {
    switch (type) {
      case CryptoType.EL:
      case PaymentCryptoType.EL:
        return require('../assets/images/el.png');
      case CryptoType.ETH:
      case PaymentCryptoType.ETH:
        return require('../assets/images/eth.png');
      case CryptoType.BNB:
      case PaymentCryptoType.BNB:
        return require('../assets/images/bnb.png');
      case CryptoType.ELA:
        return require('../assets/images/asset.png');
      case 'none':
        return;
      default:
        return { uri: type };
    }
  };

  const image = SwitchIcon(type);
  if (typeof image === 'object') {
    return (
      <CachedImage
        source={image}
        cacheKey={image.uri.replace(/\//g, '_')}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          ...(style as {}),
        }}
      />
    );
  } else {
    return (
      <Image
        source={image}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          ...(style as {}),
        }}
      />
    );
  }
};

export default CryptoImage;

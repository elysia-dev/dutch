import React from 'react'
import { Image, ImageStyle, StyleProp } from "react-native"
import CryptoType from '../../enums/CryptoType'
import PaymentCryptoType from '../../enums/PaymentCryptoType'

const CryptoImage: React.FC<{ type: CryptoType | PaymentCryptoType | string, style?: StyleProp<ImageStyle> }> = ({ type, style }) => {
  const SwitchIcon = (type: CryptoType | PaymentCryptoType | string) => {
    switch (type) {
      case CryptoType.EL:
      case PaymentCryptoType.EL: 
        return require('../assets/images/el.png')
        break;
      case CryptoType.ETH:
      case PaymentCryptoType.ETH:
        return require('../assets/images/eth.png')
        break;
      case CryptoType.BNB:
      case PaymentCryptoType.BNB:
        return require('../assets/images/bnb.png')
        break;
      case CryptoType.ELA:
        return require('../assets/images/asset.png')
        break;
      default:
        return {uri: type}
        break;
    }
  }
  return (
    <Image
      source={SwitchIcon(type)}
      style={{
        width: 40,
        height: 40,
        borderRadius: 40,
        ...style as {},
      }}
    />
  )
}

export default CryptoImage
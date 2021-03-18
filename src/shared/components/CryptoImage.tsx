import React from 'react'
import { Image, ImageStyle, StyleProp } from "react-native"
import CryptoType from '../../enums/CryptoType'

const CryptoImage: React.FC<{ type: CryptoType, style?: StyleProp<ImageStyle> }> = ({ type, style }) => {
  return (
    <Image
      source={
        type === CryptoType.EL ?
          require('../assets/images/el.png') :
          type === CryptoType.ETH ?
            require('../assets/images/eth.png') :
            type === CryptoType.BNB ?
              require('../assets/images/bnb.png') :
              require('../assets/images/asset.png')
      }
      style={{
        width: 40,
        height: 40,
        ...style as {},
      }}
    />
  )
}

export default CryptoImage
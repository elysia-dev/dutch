import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import * as Linking from 'expo-linking';

const ExchangeButton: React.FC<{
  url: string;
  img: number;
}> = ({
  url,
  img,
}) => {
  return (
    <TouchableOpacity
      style={{
        width: 100,
        marginHorizontal: 5,
      }}
      onPress={() => Linking.openURL(url)}>
      <Image
        source={img}
        style={{
          width: 95,
          height: 95,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default ExchangeButton;

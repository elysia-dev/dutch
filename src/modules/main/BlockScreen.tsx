import React, { FunctionComponent } from 'react';
import { View, Image } from 'react-native';

const BlockScreen: FunctionComponent = () => {
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: '#3679B5' }}>
      <Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }}
        source={require('../../../assets/splash.png')}></Image>
    </View>
  );
};

export default BlockScreen;

import React, { FunctionComponent } from 'react';
import { View, Image } from 'react-native';
import AppColors from '../../enums/AppColors';

const BlockScreen: FunctionComponent = () => {
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: AppColors.MAIN }}>
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

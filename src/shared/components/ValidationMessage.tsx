import React, { FunctionComponent } from 'react';
import { View, Image, Text } from 'react-native';
import WarningImg from '../assets/images/warning.png';
import AppColors from '../../enums/AppColors';

interface Iprops {
  message: string;
}

const ValidationMessage: FunctionComponent<Iprops> = ({ message }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 5 }}>
      <Image
        source={WarningImg}
        style={{
          marginTop: 1,
          width: 12,
          height: 12,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: AppColors.BLACK,
        }}>
        {message}
      </Text>
    </View>
  );
};

export default ValidationMessage;

import React from 'react';
import { View, Image, Text, StyleProp, ViewStyle } from 'react-native';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';

interface Props {
  text: string;
  style?: StyleProp<ViewStyle>;
}

const GuideTextInvalid: React.FC<Props> = ({ text, style }) => {
  return (
    <View
      style={{
        ...(style as {}),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
      }}>
      <Image
        source={require('../images/alert_icon_xxhdpi.png')}
        style={{
          width: 15,
          height: 15,
          marginRight: 3,
        }}
      />
      <Text
        style={{
          textAlign: 'right',
          color: AppColors.ERROR_RED,
          fontSize: 12,
          fontFamily: AppFonts.Medium,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default GuideTextInvalid;

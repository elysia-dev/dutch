import React from 'react';
import { View, Text, Platform } from 'react-native';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import AppColors from '../../../enums/AppColors';

const LargeTextInput: React.FC<{
  placeholder: string;
  value: string;
  unit: string;
}> = ({ placeholder, value, unit }) => {
  if (value) {
    let valueFontSize = 30;
    if (value.length > 10) {
      valueFontSize -= value.length - 10;
    }

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: 30,
          }}>
          <Text
            style={{
              fontSize: valueFontSize,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Bold,
            }}>
            {commaFormatter(value)}
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: AppColors.BLACK2,
              fontFamily: AppFonts.Bold,
              marginBottom: 1,
              marginLeft: 5,
            }}>
            {unit}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: AppColors.MAIN,
            width: '100%',
            marginTop: 12,
          }}
        />
      </>
    );
  } else {
    return (
      <>
        <Text
          style={{
            fontSize: 25,
            textAlign: 'center',
            color: AppColors.DEACTIVATED,
            fontFamily: AppFonts.Medium,
            marginTop: 30 + (Platform.OS === 'ios' ? 6.5 : 7.625),
          }}>
          {placeholder}
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: AppColors.MAIN,
            width: '100%',
            marginTop: 12,
          }}
        />
      </>
    );
  }
};

export default LargeTextInput;

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
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginBottom: Platform.OS === 'ios' ? -2.5 : 0,
          }}>
          <View
            style={{
              height: 61,
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: valueFontSize,
                color: AppColors.BLACK,
                fontFamily: AppFonts.Bold,
              }}>
              {commaFormatter(value)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 25,
              color: AppColors.BLACK2,
              fontFamily: AppFonts.Bold,
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
            marginTop: 12,
            marginBottom: 9,
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

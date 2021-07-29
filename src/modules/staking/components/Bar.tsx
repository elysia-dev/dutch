import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const Bar: React.FC<{ index: number }> = ({ index }) => {
  return (
    <View style={{ width: '16.7%' }}>
      <View
        style={{
          height: 8,
          backgroundColor: AppColors.SUB_GREY,
          borderTopLeftRadius: index === 1 ? 4 : 0,
          borderBottomLeftRadius: index === 1 ? 4 : 0,
          borderTopRightRadius: index === 6 ? 4 : 0,
          borderBottomRightRadius: index === 6 ? 4 : 0,
        }}
      />
      <View
        style={{
          width: '100%',
          position: 'absolute',
        }}>
        <View
          style={{
            height: 8,
            backgroundColor: '#3ECFFF',
            borderTopLeftRadius: index === 1 ? 4 : 0,
            borderBottomLeftRadius: index === 1 ? 4 : 0,
            borderTopRightRadius: index === 6 ? 4 : 0,
            borderBottomRightRadius: index === 6 ? 4 : 0,
          }}
        />
        <Text
          style={{
            marginTop: 4,
            alignSelf: 'center',
            color: AppColors.BLACK,
            fontFamily: AppFonts.Bold,
            fontSize: 12,
          }}>
          1차
        </Text>
        <View
          style={{
            position: 'absolute',
            right: 0,
            borderRightWidth: 1,
            borderRightColor: AppColors.BLACK,
            height: '100%',
          }}
        />
      </View>
      <View />
    </View>
  );
};

export default Bar;

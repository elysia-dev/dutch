import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const Bar: React.FC<{ round: 1 | 2 | 3 | 4 | 5 | 6; percent: number }> = ({
  round,
  percent,
}) => {
  return (
    <View style={{ width: '16.7%' }}>
      <View
        style={{
          height: 8,
          backgroundColor: AppColors.SUB_GREY,
          borderTopLeftRadius: round === 1 ? 4 : 0,
          borderBottomLeftRadius: round === 1 ? 4 : 0,
          borderTopRightRadius: round === 6 ? 4 : 0,
          borderBottomRightRadius: round === 6 ? 4 : 0,
        }}
      />
      <View
        style={{
          width: '100%',
          position: 'absolute',
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: 8,
            backgroundColor: '#3ECFFF',
            borderTopLeftRadius: round === 1 ? 4 : 0,
            borderBottomLeftRadius: round === 1 ? 4 : 0,
            borderTopRightRadius: round === 6 || percent < 100 ? 4 : 0,
            borderBottomRightRadius: round === 6 || percent < 100 ? 4 : 0,
            width: `${percent}%`,
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
          {`${round}차`}
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

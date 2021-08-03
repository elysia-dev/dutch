import React from 'react';
import { View, Platform } from 'react-native';
import GuideText from '../../../shared/components/GuideText';
import AppColors from '../../../enums/AppColors';

const InputInfoBox: React.FC<{ list: string[] }> = ({ list }) => {
  return (
    <View
      style={{
        marginTop: 10,
        width: '100%',
        borderColor: AppColors.SUB_GREY,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: Platform.OS === 'android' ? 60 : 30,
      }}>
      {list.map((text, i) => (
        <GuideText text={text} style={{ marginTop: i === 0 ? 0 : 6 }} />
      ))}
    </View>
  );
};

export default InputInfoBox;

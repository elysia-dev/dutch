import React from 'react';
import { View, Platform } from 'react-native';
import GuideText from '../../../shared/components/GuideText';
import AppColors from '../../../enums/AppColors';
import GuideTextInvalid from '../../../shared/components/GuideTextInvalid';
// import CryptoType from '../../../enums/CryptoType';

const InputInfoBox: React.FC<{
  list: string[];
  isInvalid: boolean;
  invalidText: string;
}> = ({ list, isInvalid, invalidText }) => {
  return (
    <View style={{ marginBottom: Platform.OS === 'android' ? 60 : 30 }}>
      <View
        style={{
          marginTop: 10,
          width: '100%',
          borderColor: AppColors.SUB_GREY,
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 12,
          paddingHorizontal: 10,
          marginBottom: 8,
        }}>
        {list.map((text, i) => (
          <GuideText text={text} style={{ marginTop: i === 0 ? 0 : 6 }} />
        ))}
      </View>
      {isInvalid ? (
        <GuideTextInvalid text={invalidText} />
      ) : (
        <View style={{ height: 16.5 }} />
      )}
    </View>
  );
};

export default InputInfoBox;

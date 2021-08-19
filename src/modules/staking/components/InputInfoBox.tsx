import React from 'react';
import { View, Platform } from 'react-native';
import GuideText from '../../../shared/components/GuideText';
import AppColors from '../../../enums/AppColors';

const InputInfoBox: React.FC<{}> = () => {
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
      <GuideText text={`스테이킹 달러 가치 : $100.00`} />
      <GuideText
        text={`스테이킹 가능 수량 : 100,000 EL`}
        style={{ marginTop: 6 }}
      />
      <GuideText text="예상 가스비 : 0.01 ETH" style={{ marginTop: 6 }} />
    </View>
  );
};

export default InputInfoBox;

import React, {
  FunctionComponent,
} from 'react';
import { View, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { P1Text, H4Text, P3Text } from '../../../shared/components/Texts';
import AppColors from '../../../enums/AppColors';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';

interface Props {
  active: boolean
  title: string
  value: string
  subValue?: string
  cryptoType: CryptoType
  cryptoTitle: string
  style?: StyleProp<ViewStyle>
  onPress: () => void
}

const CryptoInput: FunctionComponent<Props> = ({
  active,
  title,
  value,
  subValue,
  cryptoTitle,
  cryptoType,
  style,
  onPress,
}) => {
  return (
    <View style={style}>
      <H4Text label={title} style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={{
          borderColor: active ? AppColors.MAIN : AppColors.BLUE_2,
          borderRadius: 5,
          borderWidth: 1,
          padding: 10,
          flexDirection: 'row'
        }}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CryptoImage type={cryptoType} style={{ width: 20, height: 20 }} />
          <P1Text label={cryptoTitle} style={{ marginLeft: 5 }} />
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <P1Text label={`${value} ${cryptoType}`} style={{ textAlign: 'right' }} />
          {subValue && <P3Text label={subValue} style={{ color: AppColors.BLACK2, textAlign: 'right' }} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CryptoInput;

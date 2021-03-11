import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../../enums/AppColors';
import { H3Text, P3Text } from '../../../shared/components/Texts';
import CheckIcon from './CheckIcon';

interface IConfirmBox {
  confirmed: boolean,
  toggleConfirm: () => void,
  title: string,
  content: string,
  style?: StyleProp<ViewStyle>,
}

const ConfirmBox: React.FC<IConfirmBox> = (props) => {
  return (
    <View style={props.style}>
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderRadius: 5,
          borderColor: AppColors.GREY,
        }}
        onPress={props.toggleConfirm}
      >
        <View style={{ padding: 15, display: 'flex', flexDirection: 'row' }}>
          <CheckIcon checked={props.confirmed} />
          <H3Text label={props.title} style={{ marginLeft: 10 }} />
        </View>
        <View style={{ height: 2, backgroundColor: AppColors.GREY }} />
        <View style={{ padding: 15 }}>
          <P3Text label={props.content} style={{ lineHeight: 20 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmBox;
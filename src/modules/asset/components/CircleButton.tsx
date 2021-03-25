import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../../enums/AppColors';
import { H4Text } from '../../../shared/components/Texts';

const CircleButton: React.FC<{ handler: () => void, icon: string, title: string, disabled?: boolean }> = ({
  handler,
  icon,
  title,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'column', alignItems: 'center' }}
      disabled={disabled}
      onPress={() => {
        handler()
      }}
    >
      <View
        style={{
          width: 55,
          height: 55,
          borderRadius: 27.5,
          backgroundColor: disabled ? AppColors.GREY : AppColors.MAIN,
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            color: AppColors.WHITE,
            fontSize: 27,
            textAlign: 'center'
          }}
        >{icon}</Text>
      </View>
      <H4Text label={title} style={{ marginTop: 10 }} />
    </TouchableOpacity>
  )
}

export default CircleButton;
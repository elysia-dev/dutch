import React, { FunctionComponent } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import WalletType from '../../enums/WalletType';
import AppColors from '../../enums/AppColors';

type ButtonProps = {
  title: string;
  selected: boolean;
  modeHandler: () => void;
  type: string;
};

const buttonImage = (type: string, selected: boolean) => {
  switch (type) {
    case WalletType.METAMASK_MOBILE:
      return selected
        ? require('../assets/images/selected_mobile.png')
        : require('../assets/images/mobile.png');
    case WalletType.METAMASK_PC:
      return selected
        ? require('../assets/images/selected_desktop.png')
        : require('../assets/images/desktop.png');
    case WalletType.IMTOKEN_MOBILE:
      return selected
        ? require('../assets/images/selected_imtoken.png')
        : require('../assets/images/imtoken.png');
    default:
  }
};

const WalletSelectionButton: FunctionComponent<ButtonProps> = (
  props: ButtonProps,
) => {
  return (
    <TouchableOpacity
      onPress={props.modeHandler}
      style={{
        width: '100%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: props.selected ? AppColors.MAIN : AppColors.BLUE_2,
        padding: 15,
        flexDirection: 'row',
        marginBottom: 15,
      }}>
      <Image
        style={{ alignSelf: 'center' }}
        source={buttonImage(props.type, props.selected)}></Image>
      <Text
        style={{
          flex: 5,
          fontSize: 14,
          paddingLeft: 10,
          fontWeight: props.selected ? 'bold' : 'normal',
          color: AppColors.BLACK,
          alignSelf: 'center',
        }}>
        {props.title}
      </Text>
      {props.selected && (
        <Image
          style={{ alignSelf: 'center' }}
          source={require('../assets/images/bluebuttoncheck.png')}></Image>
      )}
    </TouchableOpacity>
  );
};

export default WalletSelectionButton;

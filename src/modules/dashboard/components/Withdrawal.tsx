/* eslint-disable radix */
import React, {
  FunctionComponent, useEffect, useState,
} from 'react';
import { View, Image, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import AppColors from '../../../enums/AppColors';
import NextButton from '../../../shared/components/NextButton';
import { H3Text, P2Text, P3Text, P4Text } from '../../../shared/components/Texts';
import i18n from '../../../i18n/i18n';

interface Props {
  modalHandler: () => void;
  submitHandler: () => void;
}

const Withdrawal: FunctionComponent<Props> = props => {
  const remains = '100';
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboard(true)
  };

  const _keyboardDidHide = () => {
    setKeyboard(false)
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: keyboard ? 640 : 380,
        width: '100%',
        backgroundColor: '#fff',
      }}>
      <TouchableOpacity
        style={{
          marginTop: 20,
        }}
        onPress={props.modalHandler}>
        <Image
          source={require('../images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
      <H3Text label={i18n.t('wallet.withdrawal')} />
      <P2Text label={i18n.t('wallet.withdrawal_address')} style={{ color: AppColors.BLACK, marginTop: 30 }} />
      <TextInput
        style={{
          height: 40,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: AppColors.SUB_GREY,
          padding: 10,
          marginTop: 5,
        }}
        value={to}
        onChangeText={setTo}
        placeholder={i18n.t('wallet.withdrawal_content')}
      />
      <P2Text label={i18n.t('wallet.send_value')} style={{ color: AppColors.BLACK, marginTop: 30 }} />
      <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}>
        <TextInput
          style={{
            height: 40,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: AppColors.SUB_GREY,
            padding: 10,
            flex: 1,
          }}
          value={value}
          onChangeText={setValue}
          placeholder={i18n.t('wallet.insert_value')}
        />
        <TouchableOpacity
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: AppColors.MAIN,
            height: 40,
            width: 45,
            marginLeft: 10,
            paddingTop: 12,
          }}
        >
          <P3Text label={i18n.t('wallet.full')} style={{ color: AppColors.MAIN, textAlign: 'center' }} />
        </TouchableOpacity>
      </View>
      <P4Text label={`${i18n.t('wallet.remaining_value')} : ${remains}`} style={{ marginTop: 5 }} />
      <NextButton
        title={i18n.t('wallet.withdrawal')}
        style={{
          width: '100%',
          marginTop: 30,
        }}
        handler={props.submitHandler}
      />
    </View>
  );
};

export default Withdrawal;

/* eslint-disable radix */
import React, {
  FunctionComponent, useState,
} from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import AppColors from '../../enums/AppColors';
import { useTranslation } from 'react-i18next';
import NextButton from '../../shared/components/NextButton';
import SheetHeader from '../../shared/components/SheetHeader';
import { P2Text, P3Text, P4Text } from '../../shared/components/Texts';

interface Props {
  modalHandler: () => void;
  submitHandler: () => void;
}

const Withdrawal: FunctionComponent<Props> = props => {
  const remains = '100';
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  return (
    <>
      <SheetHeader title={t('wallet.withdrawal')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          backgroundColor: '#fff',
        }}>
        <P2Text label={t('wallet.withdrawal_address')} style={{ color: AppColors.BLACK, marginTop: 30 }} />
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
          placeholder={t('wallet.withdrawal_content')}
        />
        <P2Text label={t('wallet.send_value')} style={{ color: AppColors.BLACK, marginTop: 30 }} />
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
            placeholder={t('wallet.insert_value')}
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
            <P3Text label={t('wallet.full')} style={{ color: AppColors.MAIN, textAlign: 'center' }} />
          </TouchableOpacity>
        </View>
        <P4Text label={`${t('wallet.remaining_value')} : ${remains}`} style={{ marginTop: 5 }} />
        <NextButton
          title={t('wallet.withdrawal')}
          style={{
            width: '100%',
            marginTop: 30,
          }}
          handler={props.submitHandler}
        />
      </View>
    </>
  );
};

export default Withdrawal;

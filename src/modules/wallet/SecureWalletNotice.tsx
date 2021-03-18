import React, { FunctionComponent, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from '../../shared/components/NextButton';
import ConfirmBox from './components/ConfirmBox';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { P1Text } from '../../shared/components/Texts';
import CheckIcon from './components/CheckIcon';
import BasicLayout from '../../shared/components/BasicLayout';
import i18n from '../../i18n/i18n'

const SecureWalletNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const [confirmed, setConfirm] = useState<boolean[]>([false, false]);

  return (
    <BasicLayout>
      <ConfirmBox
        style={{ marginTop: 50 }}
        confirmed={confirmed[0]}
        toggleConfirm={() => { setConfirm([!confirmed[0], confirmed[1]]) }}
        title={i18n.t('recovery_key.keep')}
        content={i18n.t('recovery_key.keep_content')}
      />
      <ConfirmBox
        style={{ marginTop: 20 }}
        confirmed={confirmed[1]}
        toggleConfirm={() => { setConfirm([confirmed[0], !confirmed[1]]) }}
        title={i18n.t('recovery_key.lost')}
        content={i18n.t('recovery_key.lost_content')}
      />
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => {
          const next = confirmed[0] && confirmed[1]
          setConfirm([!next, !next])
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
          <CheckIcon checked={confirmed[0] && confirmed[1]} />
          <P1Text style={{ marginLeft: 10 }} label={i18n.t('recovery_key.checkbox')} />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={i18n.t('recovery_key.next')}
          disabled={!confirmed[0] || !confirmed[1]}
          handler={() => navigation.navigate(WalletPage.SeedPharase)}
        />
      </View>
    </BasicLayout>
  );
};

export default SecureWalletNotice;
import React, { FunctionComponent, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from '../../shared/components/NextButton';
import ConfirmBox from './components/ConfirmBox';
import { P1Text } from '../../shared/components/Texts';
import CheckIcon from './components/CheckIcon';
import BasicLayout from '../../shared/components/BasicLayout';

const SecureWalletNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const [confirmed, setConfirm] = useState<boolean[]>([false, false]);
  const { t } = useTranslation();

  return (
    <BasicLayout>
      <ConfirmBox
        style={{ marginTop: 50 }}
        confirmed={confirmed[0]}
        toggleConfirm={() => {
          setConfirm([!confirmed[0], confirmed[1]]);
        }}
        title={t('recovery_key.keep')}
        content={t('recovery_key.keep_content')}
      />
      <ConfirmBox
        style={{ marginTop: 20 }}
        confirmed={confirmed[1]}
        toggleConfirm={() => {
          setConfirm([confirmed[0], !confirmed[1]]);
        }}
        title={t('recovery_key.lost')}
        content={t('recovery_key.lost_content')}
      />
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => {
          const next = confirmed[0] && confirmed[1];
          setConfirm([!next, !next]);
        }}>
        <View
          style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
          <CheckIcon checked={confirmed[0] && confirmed[1]} />
          <P1Text
            style={{ marginLeft: 10 }}
            label={t('recovery_key.checkbox')}
          />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={t('recovery_key.next')}
          disabled={!confirmed[0] || !confirmed[1]}
          handler={() => navigation.navigate(WalletPage.SeedPharase)}
        />
      </View>
    </BasicLayout>
  );
};

export default SecureWalletNotice;

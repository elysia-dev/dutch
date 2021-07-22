import React, { FunctionComponent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AccountLayout from '../../shared/components/AccountLayout';
import { P1Text, TitleText } from '../../shared/components/Texts';
import { TextField } from '../../shared/components/TextField';
import WalletContext from '../../contexts/WalletContext';
import NextButton from '../../shared/components/NextButton';
import BasicLayout from '../../shared/components/BasicLayout';
import MnemonicView from '../wallet/components/MnemonicView';
import { BackButton } from '../../shared/components/BackButton';
import AppColors from '../../enums/AppColors';

const CheckMnemonic: FunctionComponent = () => {
  const navigation = useNavigation();
  const [stage, setStage] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(0);
  const [visible, setVisible] = useState(false);
  const { validatePassword, wallet } = useContext(WalletContext);
  const { t } = useTranslation();

  if (stage === 0) {
    return (
      <AccountLayout
        title={
          <>
            <View style={{ marginTop: 20 }}>
              <BackButton handler={() => navigation.goBack()} />
            </View>
            <TitleText
              style={{ marginTop: 10 }}
              label={t('account.insert_password')}
            />
          </>
        }
        body={
          <>
            <TextField
              style={{ marginTop: 40 }}
              label={t('account_label.account_password')}
              eventHandler={(input: string) =>
                setPassword(input)
              }
              value={password}
              secure={true}
              helperText={error ? t('account_errors.password_do_not_match') : undefined}
              helperIcon={error ? 'Error' : undefined}
            />
          </>
        }
        button={
          <>
            <NextButton
              style={{ marginTop: 'auto', marginLeft: '5%', marginRight: '5%' }}
              title={t('account_label.continue')}
              handler={() => {
                if (validatePassword(password)) {
                  setStage(1);
                } else {
                  setError(1);
                }
              }}
            />
          </>
        }
      />
    );
  } else {
    return (
      <BasicLayout>
        <View style={{ marginTop: 20 }}>
          <BackButton handler={() => navigation.goBack()} />
        </View>
        <TitleText
          style={{ marginTop: 10, lineHeight: 35, marginBottom: 25 }}
          label={t('recovery_key.backup_seed')}
        />
        {
          visible ?
            <TouchableOpacity onPress={() => setVisible(false)}>
              <MnemonicView mnemonic={wallet?.getMnemonic() || ''} />
            </TouchableOpacity> :
            <TouchableOpacity
              style={{ height: 300, backgroundColor: AppColors.BACKGROUND_GREY, justifyContent: 'center', borderRadius: 5 }}
              onPress={() => { setVisible(true); }}
            >
              <P1Text label={t('recovery_key.check_after_click')} style={{ textAlign: 'center' }} />
            </TouchableOpacity>
        }
      </BasicLayout>
    );
  }
};

export default CheckMnemonic;

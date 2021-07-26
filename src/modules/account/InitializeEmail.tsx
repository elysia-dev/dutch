import React, { FunctionComponent, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { TitleText } from '../../shared/components/Texts';

import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import checkMail from '../../utiles/checkMail';
import { SignInStatus } from '../../enums/SignInStatus';
import { BackButton } from '../../shared/components/BackButton';
import UserContext from '../../contexts/UserContext';
import AppColors from '../../enums/AppColors';

const InitializeEmail: FunctionComponent = () => {
  const [state, setState] = useState({
    email: '',
    errorLength: 1,
    errorReg: 0,
  });

  const navigation = useNavigation();
  const { signedIn, Server } = useContext(UserContext);
  const { t } = useTranslation();

  const callEmailApi = () => {
    if (!state.email) {
      alert(t('account.insert_account_email'));
      return;
    }

    Server.initializeEmail(state.email)
      .then((res) => {
        if (res.data.status === 'exist') {
          navigation.navigate(AccountPage.Login, {
            verificationId: res.data.verificationId,
            email: state.email,
          });
        } else {
          alert(t('account_errors.unmatched_email'));
        }
      })
      .catch((e) => {
        alert(t('account_errors.unmatched_email'));
      });
  };

  return (
    <>
      <Modal visible={signedIn === SignInStatus.PENDING} transparent={false}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color={AppColors.MAIN} />
        </View>
      </Modal>
      <AccountLayout
        title={
          <>
            <BackButton
              handler={() => {
                navigation.goBack();
              }}
            />
            <TitleText
              // style={{ paddingTop: 53 }}
              label={t('account.insert_account_email')}
            />
          </>
        }
        body={
          <TextField
            label={t('account_label.account_email')}
            eventHandler={(input: string) => {
              setState({
                email: input,
                errorLength: input.length === 0 ? 1 : 0,
                errorReg: checkMail(input) ? 0 : 1,
              });
            }}
            placeHolder="example@elysia.land"
          />
        }
        button={
          <SubmitButton
            title={
              // eslint-disable-next-line no-nested-ternary
              state.errorLength === 1
                ? t('account.insert_account_email')
                : state.errorReg === 1
                ? t('account.check_email')
                : t('account_label.continue')
            }
            handler={
              state.errorLength === 1 || state.errorReg === 1
                ? () => {}
                : () => callEmailApi()
            }
            variant={
              state.errorLength === 1 || state.errorReg === 1
                ? 'GrayTheme'
                : undefined
            }
          />
        }
      />
    </>
  );
};

export default InitializeEmail;

import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { H1Text, P1Text, P3Text } from '../../shared/components/Texts';
import currentLocalization from '../../utiles/currentLocalization';
import UserContext from '../../contexts/UserContext';
import AppColors from '../../enums/AppColors';

type ParamList = {
  CertifyRecover: {
    email: string;
    verificationId: string;
  };
};

const CertifyRecover: FunctionComponent<{}> = () => {
  const [state, setState] = useState({
    code: '',
    verificationId: '',
  });

  const navigation = useNavigation();
  const { Server } = useContext(UserContext);
  const route = useRoute<RouteProp<ParamList, 'CertifyRecover'>>();
  const { t } = useTranslation();

  const callResendApi: () => void = () => {
    Server.certifyEmail_recover(
      route.params.email,
      'recoverPassword',
      currentLocalization(),
    )
      .then((res) => {
        setState({ ...state, verificationId: res.data.verificationId! });
        alert(t('account.resend_verification'));
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(t('account.invalid_email'));
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
        } else {
          alert(t('account.try_again_later'));
        }
      });
  };

  const callCertifyApi = () => {
    if (!state.code) {
      alert(t('account.authentication_recover'));
      return;
    }
    Server.certifyEmail(
      state.verificationId === ''
        ? route.params.verificationId
        : state.verificationId,
      state.code,
    )
      .then((res) => {
        if (res.data.status === 'completed') {
          navigation.navigate(AccountPage.RecoverPassword, {
            email: route.params.email,
            verificationId:
              state.verificationId === ''
                ? route.params.verificationId
                : state.verificationId,
          });
        } else if (res.data.status === 'expired') {
          alert(t('account.expired_verification'));

          //   navigation.navigate(AccountPage.InitializeEmail);
        } else {
          alert(
            t('account.unmatched_verification', {
              error: res.data.counts,
            }),
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(t('account.authentication_recover'));
        } else if (e.response.status === 404) {
          alert(t('account.expired_verification'));
          navigation.navigate(AccountPage.InitializeEmail);
        }
      });
  };

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => navigation.navigate(AccountPage.InitializeEmail)}
          />
          <H1Text
            style={{ marginBottom: 10 }}
            label={t('account.authentication_recover')}
          />
          <P1Text label={t('account.authentication_recover_label')} />
        </>
      }
      body={
        <>
          <TextField
            label={t('account_label.account_email')}
            editable={false}
            value={route.params.email}
            eventHandler={() => { }}
          />
          <TextField
            label={t('account_label.authentication_code')}
            eventHandler={(value) => {
              setState({ ...state, code: value });
            }}
          />
          <View style={{ bottom: 10, flexDirection: 'row-reverse' }}>
            <BorderFlatButton
              title={t('account_label.resend')}
              handler={() => callResendApi()}
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <P3Text
                style={{
                  marginLeft: 'auto',
                  lineHeight: 21,
                  height: 21,
                  color: AppColors.BLACK,
                }}
                label={`${t('account.expiration_time')}`}
              />
            </View>
          </View>
        </>
      }
      button={
        <SubmitButton
          title={t('account_label.certify')}
          handler={() => callCertifyApi()}
        />
      }
    />
  );
};

export default CertifyRecover;

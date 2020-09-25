import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { Timer } from './components/Timer';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';

interface Props {
  existence: string;
  certified: string;
}

type ParamList = {
  CertifySignup: {
    email: string;
    verificationId: string;
  };
};

const CertifySignup: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    code: '',
    verificationId: '',
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'CertifySignup'>>();

  const callResendApi = (): void => {
    Api.initializeEmail(route.params.email)
      .then(res => {
        setState({
          ...state,
          verificationId: res.data.verificationId!,
        });
        alert(i18n.t('account.resend_verification'));
      })
      .catch(e => {
        alert(i18n.t('account.try_again_later'));
      });
  };

  const callCertifyApi = (): void => {
    if (!state.code) {
      alert(i18n.t('account.authentication_recover'));
      return;
    }
    Api.certifyEmail(
      state.verificationId === ''
        ? route.params.verificationId
        : state.verificationId,
      state.code,
    )
      .then(res => {
        if (res.data.status === 'completed') {
          navigation.navigate(AccountPage.Signup, {
            email: route.params.email,
            verificationId:
              state.verificationId === ''
                ? route.params.verificationId
                : state.verificationId,
          });
        } else if (res.data.status === 'expired') {
          alert(i18n.t('account.expired_verification'));
          //   navigation.navigate(AccountPage.InitializeEmail);
        } else {
          alert(
            i18n.t('account.unmatched_verification', {
              error: res.data.counts,
            }),
          );
        }
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('account.authentication_recover'));
        } else if (e.response.status === 404) {
          alert(i18n.t('account.expired_verification'));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
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
            label={i18n.t('account.authentication_signup')}
          />
          <PText label={i18n.t('account.authentication_signup_label')} />
        </>
      }
      body={
        <>
          <TextField
            label={i18n.t('account_label.account_email')}
            editable={false}
            value={route.params.email}
            eventHandler={() => { }}
          />
          <TextField
            label={i18n.t('account_label.authentication_code')}
            eventHandler={value => setState({ ...state, code: value })}
          />
          <View style={{ bottom: 10, flexDirection: 'row-reverse' }}>
            <BorderFlatButton
              title={i18n.t('account_label.resend')}
              handler={() => callResendApi()}
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <PText
                style={{ marginLeft: 'auto', lineHeight: 21, height: 21 }}
                label={`${i18n.t('account.expiration_time')}`}
              />
              <Timer verif={state.verificationId} />
            </View>
          </View>
        </>
      }
      button={
        <>
          <SubmitButton
            title={i18n.t('account_label.certify')}
            handler={(): void => callCertifyApi()}
          />
        </>
      }
    />
  );
};

export default CertifySignup;

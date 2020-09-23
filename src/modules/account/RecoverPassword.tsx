import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Modal } from '../../shared/components/Modal';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
import AcceptedImg from './images/accepted.png';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import PasswordForm from './PasswordForm';

const Accepted = styled.Image`
  width: 64px;
  height: 60px;
  margin: 10px auto;
`;

type ParamList = {
  RecoverPassword: {
    email: string;
    verificationId: string;
  };
};

const RecoverPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    modalVisible: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'RecoverPassword'>>();

  const callChangeApi = (password: string) => {
    Api.recoverPassword(route.params.verificationId, password)
      .then(() => {
        setState({ modalVisible: true });
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('recover_error'));
        } else if (e.reponse.status === 404) {
          alert(i18n.t('account.recover_verification_error'));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <View>
      <View
        style={{
          top: 25,
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: state.modalVisible === false ? 0 : 999,
          backgroundColor: state.modalVisible === false ? '#FFFFFF' : '#000000',
          display: state.modalVisible === false ? 'none' : 'flex',
          opacity: state.modalVisible === false ? 0 : 0.6,
        }}></View>
      <PasswordForm
        submitButtonTitle={i18n.t('account_label.change')}
        submitHandler={callChangeApi}
        message1={i18n.t('account.insert_new_password')}
        message2={i18n.t('account.password_confirm')}
      />
      {state.modalVisible === true && (
        <Modal
          child={
            <View>
              <Accepted source={AcceptedImg} />
              <H1Text
                style={{
                  textAlign: 'center',
                  marginTop: 15,
                  marginBottom: 15,
                }}
                label={i18n.t('account.password_changed')}
              />
              <PText
                style={{
                  marginBottom: 40,
                  textAlign: 'center',
                }}
                label={i18n.t('account.login_request')}
              />
            </View>
          }
          modalHandler={() => {
            setState({ modalVisible: false });
            navigation.navigate(AccountPage.InitializeEmail, { email: '' });
          }}
          visible={state.modalVisible}></Modal>
      )}
    </View>
  );
};

export default RecoverPassword;

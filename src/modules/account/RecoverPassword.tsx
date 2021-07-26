import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../shared/components/Modal';
import { TitleText, P1Text } from '../../shared/components/Texts';
import AcceptedImg from './images/accepted.png';
import { AccountPage } from '../../enums/pageEnum';
import PasswordForm from './PasswordForm';
import UserContext from '../../contexts/UserContext';
import AppColors from '../../enums/AppColors';

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
  const { Server } = useContext(UserContext);
  const { t } = useTranslation();

  const callChangeApi = (password: string) => {
    Server.recoverPassword(route.params.verificationId, password)
      .then(() => {
        setState({ modalVisible: true });
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(t('account.recover_error'));
        } else if (e.reponse.status === 404) {
          alert(t('account.recover_verification_error'));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  return (
    <View>
      <View
        style={{
          paddingTop: 25,
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: state.modalVisible === false ? 0 : 999,
          backgroundColor:
            state.modalVisible === false ? AppColors.WHITE : AppColors.BLACK,
          display: state.modalVisible === false ? 'none' : 'flex',
          opacity: state.modalVisible === false ? 0 : 0.6,
        }}></View>
      <PasswordForm
        submitButtonTitle={t('account_label.change')}
        submitHandler={callChangeApi}
        message1={t('account.insert_new_password')}
        message2={t('account.password_confirm')}
      />
      {state.modalVisible === true && (
        <Modal
          child={
            <View>
              <Image
                source={AcceptedImg}
                style={{
                  width: 140,
                  height: 140,
                  marginVertical: 10,
                  marginHorizontal: 'auto',
                }}
              />
              <TitleText
                style={{
                  textAlign: 'center',
                  marginTop: 15,
                  marginBottom: 15,
                }}
                label={t('account.password_changed')}
              />
              <P1Text
                style={{
                  marginBottom: 40,
                  textAlign: 'center',
                }}
                label={t('account.login_request')}
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

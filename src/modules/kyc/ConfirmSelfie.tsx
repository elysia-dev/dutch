/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  Props,
  useContext,
  useState,
} from 'react';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { ActivityIndicator, Modal, View } from 'react-native';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import { P1Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { LoadingStatus } from '../../enums/LoadingStatus';
import KycContext from '../../contexts/KycContext';

const SelfieImg = styled.Image`
  width: 90%;
  height: 80%;
  justify-content: center;
  align-content: center;
  left: 5%;
  resize-mode: cover;
`;

const ConfirmSelfie: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { Server } = useContext(RootContext);
  const { selfie, setHashedSelfie } = useContext(KycContext);
  const [status, setStatus] = useState(LoadingStatus.NONE);

  const callKycApi = () => {
    setStatus(LoadingStatus.PENDING);

    Server.kycUpload(selfie.uri, 'selfie')
      .then((res) => {
        setHashedSelfie(res.data.filehash);
        setStatus(LoadingStatus.SUCCESS);
        navigation.navigate(KycPage.PersonalDataInput);
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert(i18n.t('kyc.submit_error'));
          navigation.navigate('Main', { screen: 'MoreMain' });
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
        setStatus(LoadingStatus.NONE);
      });
  };

  return (
    <>
      {
        <Modal visible={status === LoadingStatus.PENDING} transparent={true}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" />
            <P1Text
              label={i18n.t('kyc.networking_argos')}
              style={{ color: '#fff', alignSelf: 'center', marginTop: 10 }}
            />
          </View>
        </Modal>
      }
      <WrapperLayout
        isScrolling={false}
        backButtonHandler={() => navigation.navigate(KycPage.TakeSelfie)}
        title={i18n.t('kyc.step2_complete')}
        subTitle={
          <P1Text
            label={i18n.t('kyc.step2_complete_text')}
            style={{ color: '#626368', marginBottom: 15 }}
          />
        }
        body={<SelfieImg source={{ uri: selfie.uri }} />}
        button={
          <>
            <SubmitButton
              title={i18n.t('kyc_label.shoot_again')}
              handler={() => navigation.navigate(KycPage.TakeSelfie)}
              variant={'WhiteTheme'}
              style={{ marginTop: 'auto', marginBottom: 10 }}
            />
            <SubmitButton
              title={i18n.t('kyc_label.submit')}
              disabled={status === LoadingStatus.PENDING}
              style={{
                backgroundColor:
                  status === LoadingStatus.PENDING ? '#D0D8DF' : '#3679B5',
              }}
              handler={() => {
                callKycApi();
              }}
            />
          </>
        }
      />
      {status === LoadingStatus.PENDING && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
    </>
  );
};
export default ConfirmSelfie;

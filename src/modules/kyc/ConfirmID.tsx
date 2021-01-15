/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  Props,
  useContext,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import WarningImg from '../../shared/assets/images/warning_white.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import {
  H3Text,
  P1Text,
  P3Text,
  SubTitleText,
} from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import RootContext from '../../contexts/RootContext';
import { LoadingStatus } from '../../enums/LoadingStatus';
import KycContext from '../../contexts/KycContext';

const SelfieImg = styled.Image`
  width: ${Platform.OS === 'android'
    ? `${Dimensions.get('window').width * 0.6}px`
    : '90%'};
  height: ${Platform.OS === 'android'
    ? `${Dimensions.get('window').width * 0.9}px`
    : '50%'};
  justify-content: center;
  align-content: center;
  left: ${Platform.OS === 'android' ? '20%' : '5%'};
`;
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin: 0px 5px;
  top: 5px;
`;
const WarningWrapper = styled.View`
  background-color: #cc3743;
  width: 80%;
  height: 90px;
  border-radius: 15px;
  margin: 10% auto 0px auto;
`;

const ConfirmID: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { idPhoto, idType } = useContext(KycContext);
  const { Server } = useContext(RootContext);
  const [status, setStatus] = useState(LoadingStatus.NONE);

  const uploadPhoto = () => {
    Server.kycUpload(
      idPhoto.uri,
      idType === 'passport' ? 'passport' : 'government_id',
    )
      .then((_res) => {
        setStatus(LoadingStatus.SUCCESS);
        navigation.navigate(KycPage.TakeSelfieBefore);
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

  const callKycApi = () => {
    setStatus(LoadingStatus.PENDING);
    Server.kycInit()
      .then(uploadPhoto)
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('kyc.submit_error'));
        } else if (e.response.status === 404) {
          alert(i18n.t('kyc.submit_error'));
        }
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
        backButtonHandler={() => navigation.goBack()}
        title={i18n.t('kyc.step1_complete')}
        subTitle={
          <SubTitleText
            label={i18n.t('kyc.step1_complete_text')}
            style={{ color: '#626368', marginBottom: 15 }}
          />
        }
        isScrolling={false}
        body={
          <>
            <SelfieImg
              source={{ uri: idPhoto.uri }}
              style={[
                {
                  // resizeMode: Platform.OS === 'android' ? 'contain' : 'center',
                  marginTop: Platform.OS === 'android' ? -60 : 20,
                  marginBottom: Platform.OS === 'android' ? -60 : 0,
                },
                {
                  transform: [
                    { rotate: Platform.OS === 'android' ? '270deg' : '0deg' },
                  ],
                },
              ]}
            />
            <WarningWrapper>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 5,
                  marginLeft: 10,
                }}>
                <WarningIcon source={WarningImg} />
                <H3Text
                  label={i18n.t('kyc.step1_tip_text_header')}
                  style={{
                    color: '#FFF',
                    lineHeight: 23,
                    fontSize: 13,
                  }}
                />
              </View>
              <P3Text
                label={i18n.t('kyc.step1_tip_case1')}
                style={{ color: '#FFF', marginLeft: 30, fontSize: 13 }}
              />
              <P3Text
                label={i18n.t('kyc.step1_tip_case2')}
                style={{
                  color: '#FFF',
                  lineHeight: 18,
                  marginLeft: 30,
                  fontSize: 13,
                }}
              />
            </WarningWrapper>
          </>
        }
        button={
          <>
            <SubmitButton
              title={i18n.t('kyc_label.shoot_again')}
              handler={() => navigation.navigate(KycPage.TakeID)}
              variant={'WhiteTheme'}
              style={{
                marginTop: 'auto',
                marginBottom: 10,
              }}
            />
            <SubmitButton
              style={{
                backgroundColor:
                  status === LoadingStatus.PENDING ? '#D0D8DF' : '#3679B5',
              }}
              disabled={status === LoadingStatus.PENDING}
              title={i18n.t('kyc_label.submit')}
              handler={async () => {
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
export default ConfirmID;

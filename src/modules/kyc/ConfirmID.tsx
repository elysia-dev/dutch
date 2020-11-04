/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  Props,
  useContext,
  useState,
} from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
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

const SelfieImg = styled.Image`
  width: 90%;
  height: 50%;
  justify-content: center;
  align-content: center;
  left: 5%;
  resize-mode: stretch;
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

type ParamList = {
  ConfirmID: {
    id_type: string;
    idPhoto: any;
  };
};

const ConfirmID: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ConfirmID'>>();
  const { Server } = useContext(RootContext);
  const [status, setStatus] = useState(LoadingStatus.NONE);

  // 나중에 아르고스 서버 테스트 할 때 사용. 지우지 마세요!
  const callKycApi = () => {
    setStatus(LoadingStatus.PENDING);
    const { id_type, idPhoto } = route.params;
    Server.kycUpload(
      idPhoto.uri,
      id_type === 'passport' ? 'passport' : 'government_id',
    )
      .then((res) => {
        setStatus(LoadingStatus.SUCCESS);
        navigation.navigate(KycPage.TakeSelfieBefore, {
          photoId_hash: res.data.filehash,
          id_type,
          idPhoto,
        });
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
              source={{ uri: route.params.idPhoto.uri }}
              style={{ resizeMode: 'cover', marginTop: 20 }}
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

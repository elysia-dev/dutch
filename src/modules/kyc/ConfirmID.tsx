/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  Props,
  useContext,
  useState,
} from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import WarningImg from '../../shared/assets/images/warning_white.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import { H3Text, P3Text, SubTitleText } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import RootContext from '../../contexts/RootContext';

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

  // 나중에 아르고스 서버 테스트 할 때 사용. 지우지 마세요!
  const callKycApi = () => {
    const { id_type, idPhoto } = route.params;
    Server.photoId(
      idPhoto.base64,
      id_type === "passport" ? "passport" : "government_id",
    )
      .then((res) => {
        navigation.navigate(KycPage.TakeSelfieBefore, {
          photoId_hash: res.data.filehash,
          id_type,
          photoId: idPhoto,
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert(i18n.t("kyc.submit_error"));
          navigation.navigate("Main", { screen: "MoreMain" });
        } else if (e.response.status === 500) {
          alert(i18n.t("account_errors.server"));
        }
      });
  };

  return (
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
              style={{ color: '#FFF', lineHeight: 18, marginLeft: 30, fontSize: 13 }}
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
            style={{ marginTop: 'auto', marginBottom: 10 }}
          />
          <SubmitButton
            title={i18n.t('kyc_label.submit')}
            handler={async () => {
              callKycApi();
            }}
          />
        </>
      }
    />
  );
};
export default ConfirmID;

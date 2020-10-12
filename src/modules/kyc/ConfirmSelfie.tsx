/* eslint-disable @typescript-eslint/camelcase */
import React, { Component, FunctionComponent, Props } from 'react';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';

import Api from '../../api/kyc';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 40px;
  margin-left: 5%;
  margin-bottom: 6px;
`;
const PText = styled.Text`
  color: #626368;
  font-size: 13px;
  margin: 0px 5%;
  margin-bottom: 42px;
`;
const SelfieImg = styled.Image`
  width: 90%;
  height: 30%;
  justify-content: center;
  align-content: center;
  left: 5%;
  position: relative;
`;
const ConfirmSelfieWrapper = styled.SafeAreaView`
  padding-top: 25px;
  flex: 1;
  background-color: #ffffff;
`;

type ParamList = {
  ConfirmSelfie: {
    selfie: any;
    photoId: any;
    id_type: string;
  };
};

const ConfirmSelfie: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ConfirmSelfie'>>();

  // 나중에 아르고스 서버 테스트 할 때 사용. 지우지 마세요!
  // callKycApi() {
  //   const { route, navigation } = this.props;
  //   const { photoId_hash, selfie, id_type, photoId } = route.params;
  //   Api.selfie(selfie.base64)
  //     .then((res) => {
  //       navigation.navigate(KycPage.PersonalDataInput, {
  //         selfie_hash: res.data.filehash,
  //         id_type: route.params.id_type,
  //         photoId_hash: photoId_hash,
  //         photoId: route.params.photoId,
  //       });
  //     })
  //     .catch((e) => {
  //       if (e.response.status === 404) {
  //         alert(i18n.t("kyc.submit_error"));
  // navigation.navigate("Main", { screen: "MoreMain" });
  //       } else if (e.response.status === 500) {
  //         alert(i18n.t("account_errors.server"));
  //       }
  //     });
  // }

  return (
    <ConfirmSelfieWrapper style={{ display: 'flex' }}>
      <BackButton
        handler={() => navigation.navigate(KycPage.TakeSelfie)}
        style={{ marginTop: 30, marginLeft: 20 }}
      />
      <H1Text>{i18n.t('kyc.step2_complete')}</H1Text>
      <PText>{i18n.t('kyc.step2_complete_text')}</PText>
      <SelfieImg
        source={{ uri: route.params.selfie.uri }}
        style={{ resizeMode: 'cover' }}
      />
      <SubmitButton
        title={i18n.t('kyc_label.shoot_again')}
        handler={() => navigation.navigate(KycPage.TakeSelfie)}
        ButtonTheme={'WhiteTheme'}
        style={{ marginTop: 'auto', marginBottom: 10 }}
      />
      <SubmitButton
        title={i18n.t('kyc_label.submit')}
        handler={() => {
          // 일단 API 호출하지 않고 화면만 넘김
          navigation.navigate(KycPage.PersonalDataInput, {
            id_type: route.params.id_type,
            photoId: route.params.photoId,
          });
        }}
        style={{ marginBottom: 10 }}
      />
    </ConfirmSelfieWrapper>
  );
};
export default ConfirmSelfie;

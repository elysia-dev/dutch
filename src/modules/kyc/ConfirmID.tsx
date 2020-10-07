import React, { Component, FunctionComponent, Props, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import WarningImg from '../../shared/assets/images/warning_white.png';
import Api from '../../api/kyc';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import { TitleText } from '../../shared/components/TitleText';
import { PText } from '../../shared/components/PText';
import WrapperLayout from '../../shared/components/WrapperLayout';

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
  top: 2px;
`;
const WarningWrapper = styled.View`
  background-color: #cc3743;
  width: 80%;
  height: 80px;
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

  // 나중에 아르고스 서버 테스트 할 때 사용. 지우지 마세요!
  // const callKycApi = () => {
  //   const { route, navigation } = this.props;
  //   const { id_type, idPhoto } = route.params;
  //   Api.photoId(
  //     idPhoto.base64,
  //     id_type === "passport" ? "passport" : "government_id"
  //   )
  //     .then((res) => {
  //       navigation.navigate(KycPage.TakeSelfieBefore, {
  //         photoId_hash: res.data.filehash,
  //         id_type: id_type,
  //         photoId: idPhoto,
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
    <WrapperLayout
      title={
        <>
          <BackButton handler={() => navigation.goBack()} />
          <TitleText label={i18n.t('kyc.step1_complete')} />
          <PText
            label={i18n.t('kyc.step1_complete_text')}
            style={{ color: '#626368', marginBottom: 15 }}
          />
        </>
      }
      isScrolling={false}
      isBackbutton={true}
      body={
        <>
          <SelfieImg
            source={{ uri: route.params.idPhoto.uri }}
            style={{ resizeMode: 'cover' }}
          />
          <WarningWrapper>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
              }}>
              <WarningIcon source={WarningImg} />
              <PText
                label={i18n.t('kyc.step1_tip_text_header')}
                style={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  lineHeight: 20,
                }}
              />
            </View>
            <PText
              label={i18n.t('kyc.step1_tip_case1')}
              style={{ color: '#FFF', lineHeight: 20, marginLeft: 30 }}
            />
            <PText
              label={i18n.t('kyc.step1_tip_case2')}
              style={{ color: '#FFF', lineHeight: 20, marginLeft: 30 }}
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
              navigation.navigate(KycPage.TakeSelfieBefore, {
                // eslint-disable-next-line @typescript-eslint/camelcase
                id_type: route.params.id_type,
                idPhoto: route.params.idPhoto,
              });
            }}
            style={{ marginBottom: 10 }}
          />
        </>
      }
    />
  );
};
export default ConfirmID;

/* eslint-disable @typescript-eslint/camelcase */
import React, { Component, FunctionComponent, Props, useContext } from 'react';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import { PText } from '../../shared/components/PText';
import WrapperLayout from '../../shared/components/WrapperLayout';

const SelfieImg = styled.Image`
  width: 90%;
  height: 80%;
  justify-content: center;
  align-content: center;
  left: 5%;
  resize-mode: cover;
`;

type ParamList = {
  ConfirmSelfie: {
    photoId_hash: string;
    selfie: any;
    idPhoto: any;
    id_type: string;
  };
};

const ConfirmSelfie: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ConfirmSelfie'>>();
  const { Server } = useContext(RootContext);

  const callKycApi = () => {
    const { photoId_hash, selfie, id_type, idPhoto } = route.params;
    Server.selfie(selfie.base64)
      .then((res) => {
        navigation.navigate(KycPage.PersonalDataInput, {
          selfie_hash: res.data.filehash,
          id_type,
          photoId_hash,
          idPhoto,
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
      isScrolling={false}
      backButtonHandler={() => navigation.navigate(KycPage.TakeSelfie)}
      title={i18n.t('kyc.step2_complete')}
      subTitle={
        <PText
          label={i18n.t('kyc.step2_complete_text')}
          style={{ color: '#626368', marginBottom: 15 }}
        />
      }
      body={<SelfieImg source={{ uri: route.params.selfie.uri }} />}
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
            handler={() => {
              callKycApi();
            }}
          />
        </>
      }
    />
  );
};
export default ConfirmSelfie;

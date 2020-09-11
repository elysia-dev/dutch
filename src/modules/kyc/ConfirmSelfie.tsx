import React, { Component, FunctionComponent, Props } from "react";
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  SafeAreaView,
} from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import KycSubmitPng from "./images/kycsubmit.png";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import Api from "../../api/kyc";
import i18n from "../../i18n/i18n";
import { KycPage } from "../../enums/pageEnum";

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

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {}

export class ConfirmSelfie extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  // 나중에 아르고스 서버 테스트 할 때 사용. 지우지 마세요!
  // callKycApi() {
  //   const { route, navigation } = this.props;
  //   const { photoId_hash, selfie, id_type, photoId } = route.params;
  //   Api.selfie(selfie.base64)
  //     .then((res) => {
  //       navigation.navigate(KycPage.PersonalDataInput, {
  //         selfie_hash: res.data.filehash,
  //         id_type: id_type,
  //         photoId_hash: photoId_hash,
  //         photoId: photoId,
  //       });
  //     })
  //     .catch((e) => {
  //       if (e.response.status === 404) {
  //         alert(i18n.t("kyc.submit_error"));
  // navigation.navigate("Main", { screen: "Info" });
  //       } else if (e.response.status === 500) {
  //         alert(i18n.t("errors.messages.server"));
  //       }
  //     });
  // }

  render() {
    const { route, navigation } = this.props;
    const { selfie, id_type, photoId } = route.params;

    return (
      <ConfirmSelfieWrapper>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step2_complete")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step2_complete_text")}</PText>
        <SelfieImg source={{ uri: selfie.uri }} />
        <SubmitButton
          title={i18n.t("kyc_label.shoot_again")}
          handler={() => navigation.navigate(KycPage.TakeSelfie)}
          ButtonTheme={"WhiteTheme"}
        />
        <SubmitButton
          title={i18n.t("kyc_label.submit")}
          handler={() => {
            //서버로 리퀘스트 보내는 함수
            // Api.selfie(selfie.base64)
            //   .then((res) => {
            navigation.navigate(KycPage.PersonalDataInput, {
              // selfie_hash: res.data.filehash,
              id_type: id_type,
              // photoId_hash: photoId_hash,
              photoId: photoId,
            });
            // })
            // .catch();
          }}
        />
      </ConfirmSelfieWrapper>
    );
  }
}

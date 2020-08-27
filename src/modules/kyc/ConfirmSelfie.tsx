import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
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
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;
const SelfieImg = styled.Image`
  width: 90%;
  height: 30%;
  justify-content: center;
  align-content: center;
  left: 5%;
  position: relative;
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

  render() {
    const { route, navigation } = this.props;
    const { selfie, id_type, photoId_hash, photoId } = route.params;

    return (
      <View style={{ backgroundColor: "#fff", height: "100%" }}>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step3_complete")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step3_complete_text")}</PText>
        <SelfieImg source={{ uri: selfie.uri }} />
        <SubmitButton
          title={i18n.t("kyc_label.shoot_again")}
          handler={() => navigation.navigate(KycPage.TakeSelfie)}
        />
        <SubmitButton
          title={i18n.t("kyc_label.submit")}
          handler={() => {
            //서버로 리퀘스트 보내는 함수
            Api.selfie(selfie.base64)
              .then((res) => {
                navigation.navigate(KycPage.PersonalDataInput, {
                  selfie_hash: res.data.filehash,
                  id_type: id_type,
                  photoId_hash: photoId_hash,
                  photoId: photoId,
                });
              })
              .catch();
          }}
        />
      </View>
    );
  }
}

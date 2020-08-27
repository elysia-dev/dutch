import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import KycSubmitPng from "./images/kycsubmit.png";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import { page } from "./Kyc";
import Api from "../../api/kyc";
import i18n from "../../i18n/i18n";
import AsyncStorage from "@react-native-community/async-storage";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;xw
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

export class ConfirmID extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { modalVisible: false };
  }

  render() {
    const { route, navigation } = this.props;
    const { id_type, idPhoto } = route.params;

    return (
      <View style={{ backgroundColor: "#fff", height: "100%" }}>
        <BackButton handler={() => navigation.goBack()} />
        <H1Text>{i18n.t("kyc.kyc_step1_complete")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step1_complete_text")}</PText>
        <SelfieImg source={{ uri: idPhoto.uri }} />
        <SubmitButton
          title={i18n.t("kyc_label.shoot_again")}
          handler={() => navigation.navigate(page.TakeID)}
        />
        <SubmitButton
          title={i18n.t("kyc_label.submit")}
          handler={async () => {
            // const token = this.getToken;
            Api.photoId(
              idPhoto.base64,
              id_type === "passport" ? "passport" : "government_id"
            )
              .then((res) => {
                navigation.navigate(page.TakeSelfieBefore, {
                  photoId_hash: res.data.filehash,
                  id_type: id_type,
                  photoId: idPhoto,
                });
              })
              .catch((e) => {
                console.error(e);
                alert(
                  "아르고스 서버 통신 오류입니다. 담당자에게 문의 바랍니다."
                );
              });
          }}
        />
      </View>
    );
  }
}

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
import WarningImg from "../../../src/shared/assets/images/warning_white.png";
import styled from "styled-components/native";
import KycSubmitPng from "./images/kycsubmit.png";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import Api from "../../api/kyc";
import i18n from "../../i18n/i18n";
import AsyncStorage from "@react-native-community/async-storage";
import { KycPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 25%;
  margin-left: 5%;
`;
const PText = styled.Text`
  font-size: 13px;
  color: #626368;
  text-align: left;
  margin-left: 5%;
  margin_bottom: 15px;
`;
const SelfieImg = styled.Image`
  width: 90%;
  height: 30%;
  justify-content: center;
  align-content: center;
  left: 5%;
  position: relative;
`;
const ConfirmIdWrapper = styled.SafeAreaView`
  padding-top: 25px;
  flex: 1;
  background-color: #ffffff;
`;
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin: 0px 5px;
  position: relative;
  top: 1px;
`;
const WarningWrapper = styled.View`
  background-color: #cc3743;
  width: 80%;
  height: 80px;
  border-radius: 15px;
  margin: 10% auto 0px auto;
`;
const WarningHeaderText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
`;
const WarningInfoText = styled.Text`
  font-size: 13px;
  color: #fff;
  line-height: 20px;
  margin-left: 30px;
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
      <ConfirmIdWrapper>
        <BackButton handler={() => navigation.goBack()} />
        <H1Text>{i18n.t("kyc.kyc_step1_complete")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step1_complete_text")}</PText>
        <SelfieImg source={{ uri: idPhoto.uri }} />
        <WarningWrapper>
          <WarningHeaderText>
            <WarningIcon source={WarningImg} /> 사진이 잘 보이려면?
          </WarningHeaderText>
          <WarningInfoText>· 대비되는 배경위에서 촬영해주세요</WarningInfoText>
          <WarningInfoText>· 프레임에 맞춰서 촬영해주세요</WarningInfoText>
        </WarningWrapper>
        <SubmitButton
          title={i18n.t("kyc_label.shoot_again")}
          handler={() => navigation.navigate(KycPage.TakeID)}
          ButtonTheme={"WhiteTheme"}
        />
        <SubmitButton
          title={i18n.t("kyc_label.submit")}
          handler={async () => {
            // const token = this.getToken;
            // Api.photoId(
            //   idPhoto.base64,
            //   id_type === "passport" ? "passport" : "government_id"
            // )
            //   .then((res) => {
            navigation.navigate(KycPage.TakeSelfieBefore, {
              // photoId_hash: res.data.filehash,
              id_type: id_type,
              photoId: idPhoto,
            });
            // })
            // .catch((e) => {
            //   console.error(e);
            //   alert(
            //     "아르고스 서버 통신 오류입니다. 담당자에게 문의 바랍니다."
            //   );
            // });
          }}
        />
      </ConfirmIdWrapper>
    );
  }
}

import React, { Component, FunctionComponent, Props, useState } from "react";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import WarningImg from "../../../src/shared/assets/images/warning_white.png";
import styled from "styled-components/native";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Api from "../../api/kyc";
import i18n from "../../i18n/i18n";
import { KycPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
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

type ParamList = {
  ConfirmID: {
    id_type: string;
    idPhoto: any;
  };
};

export const ConfirmID: FunctionComponent<props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "ConfirmID">>();

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
  // navigation.navigate("Main", { screen: "Info" });
  //       } else if (e.response.status === 500) {
  //         alert(i18n.t("errors.messages.server"));
  //       }
  //     });
  // }

  return (
    <ConfirmIdWrapper style={{ display: "flex" }}>
      <BackButton
        handler={() => navigation.goBack()}
        style={{ marginTop: 30, marginLeft: 20, marginBottom: 30 }}
      />
      <H1Text>{i18n.t("kyc.kyc_step1_complete")}</H1Text>
      <PText>{i18n.t("kyc.kyc_step1_complete_text")}</PText>
      <SelfieImg source={{ uri: route.params.idPhoto.uri }} />
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
        style={{ marginTop: "auto", marginBottom: 10 }}
      />
      <SubmitButton
        title={i18n.t("kyc_label.submit")}
        handler={async () => {
          navigation.navigate(KycPage.TakeSelfieBefore, {
            id_type: route.params.id_type,
            idPhoto: route.params.idPhoto,
          });
        }}
        style={{ marginBottom: 10 }}
      />
    </ConfirmIdWrapper>
  );
};

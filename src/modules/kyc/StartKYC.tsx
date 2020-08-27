import React, { FunctionComponent, Props } from "react";
import { Text, View } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import ClockPng from "./images/clock.png";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { page } from "./Kyc";
import { useNavigation, useRoute } from "@react-navigation/native";

const H1Text = styled.Text`
  color: #000;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  margin-top: 60px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;
const ClockImg = styled.Image`
  width: 13px;
  height: 13px;
`;

interface props {
  handler: any;
}
export const StartKYC: FunctionComponent<props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  // const { email } = route.params;

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <BackButton handler={() => navigation.goBack()} />
      <H1Text>{i18n.t("kyc.start_kyc")}</H1Text>
      <ClockImg source={ClockPng} />
      <PText>{i18n.t("kyc.start_kyc_text")}</PText>
      <Text>{i18n.t("kyc.start_kyc_step1")}</Text>
      <Text>{i18n.t("kyc.start_kyc_step2")}</Text>
      <Text>{i18n.t("kyc.start_kyc_step3")}</Text>
      <SubmitButton
        title={i18n.t("kyc_label.argos_terms")}
        handler={() => {}}
      />
      <SubmitButton
        title={i18n.t("kyc_label.agree_start")}
        // handler={() => {}}
        handler={() =>
          navigation.navigate(
            page.SelectID
            // { token: token, email: email }
          )
        }
      />
    </View>
  );
};

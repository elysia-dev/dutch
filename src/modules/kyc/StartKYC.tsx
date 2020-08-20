import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import ClockPng from "./images/clock.png";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";

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

export const StartKYC: FunctionComponent<{
  handler: any;
}> = ({ handler }) => {
  return (
    <View>
      <BackButton handler={() => {}} />
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
        handler={() => {}}
      />
    </View>
  );
};

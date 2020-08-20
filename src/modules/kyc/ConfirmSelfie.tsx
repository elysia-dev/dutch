import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";

import i18n from "../../i18n/i18n";

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

interface props {}

export const ConfirmSelfie: FunctionComponent<props> = (props) => {
  return (
    <View>
      <BackButton handler={() => {}} />
      <H1Text>{i18n.t("kyc.kyc_step3_complete")}</H1Text>
      <PText>{i18n.t("kyc.kyc_step3_complete_text")}</PText>

      <SubmitButton
        title={i18n.t("kyc_label.shoot_again")}
        handler={() => {}}
      />
      <SubmitButton title={i18n.t("kyc_label.submit")} handler={() => {}} />
    </View>
  );
};

import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import SelfieBeforePng from "./images/selfiebefore.png";

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
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  width: 90%;
  border-radius: 13px;
  border: solid 2px #d0d8df;
`;
const Selfie = styled.Image`
  position: relative;
  width: 343px;
  height: 206px;
`;

interface props {
  handler: () => void;
}
interface state {}
//modal state 때문에 class로
export class TakeSelfieBefore extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  render() {
    return (
      <View>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step3")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step3_text")}</PText>
        <Container>
          <Selfie source={SelfieBeforePng} />
        </Container>
        <Text>{i18n.t("kyc.kyc_step3_desc1")}</Text>
        <Text>{i18n.t("kyc.kyc_step3_desc2")}</Text>
        <SubmitButton title={i18n.t("kyc_label.shoot")} handler={() => {}} />
      </View>
    );
  }
}

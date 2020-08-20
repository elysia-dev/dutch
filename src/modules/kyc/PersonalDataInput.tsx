import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import { NationInput } from "./components/NationInput";

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

interface state {}
export class PersonalDataInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  render() {
    return (
      <View>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step2")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step2_text")}</PText>
        <H1Text>{i18n.t("kyc_label.personal_data")}</H1Text>
        <TextInput
          type={i18n.t("kyc_label.last_name")}
          value=""
          edit={true}
          eventHandler={() => {}}
          secure={false}
        />
        <TextInput
          type={i18n.t("kyc_label.first_name")}
          value=""
          edit={true}
          eventHandler={() => {}}
          secure={false}
        />
        <NationInput type={i18n.t("kyc_label.nationality")} />
      </View>
    );
  }
}

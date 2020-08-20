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
import { DateInput } from "./components/DateInput";
import { ShortOptionButton } from "./components/ShortOptionButton";

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
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;

interface props {}

interface state {
  gender: string;
}

export class PersonalDataInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { gender: "" };
    this.setGender = this.setGender.bind(this);
  }

  setGender(text: string) {
    this.state.gender != text
      ? this.setState({ gender: text })
      : this.setState({ gender: "" });
  }

  render() {
    return (
      <View style={{ width: 375, top: -50 }}>
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
        <DateInput type={i18n.t("kyc_label.birthday")} />
        <InputHeaderText>{i18n.t("kyc_label.gender")}</InputHeaderText>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <ShortOptionButton
            check={this.state.gender === "male" ? "checked" : ""}
            title={i18n.t("kyc_label.male")}
            handler={() => this.setGender("male")}
          />
          <ShortOptionButton
            check={this.state.gender === "female" ? "checked" : ""}
            title={i18n.t("kyc_label.female")}
            handler={() => this.setGender("female")}
          />
        </View>
        <SubmitButton
          title={i18n.t("kyc_label.complete_input")}
          handler={() => {}}
        />
      </View>
    );
  }
}

import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { OptionButton } from "./components/OptionButton";

import styled from "styled-components/native";
import CheckedPng from "./images/checked.png";
import PassportPng from "./images/passport.png";
import DriverPng from "./images/driver.png";
import IDCardPng from "./images/idcard.png";
import CheckedPassportPng from "./images/checkedpassport.png";
import CheckedDriverPng from "./images/checkeddriver.png";
import CheckedIDCardPng from "./images/checkedidcard.png";

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
const IDImg = styled.Image`
  width: 28px;
  height: 28px;
`;
const Checked = styled.Image`
  width: 7.5px;
  height: 5px;
`;

interface props {}

interface state {
  idType: string;
}

export class SelectID extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { idType: "" };
    this.setID = this.setID.bind(this);
  }

  setID(text: string) {
    this.state.idType != text
      ? this.setState({ idType: text })
      : this.setState({ idType: "" });
  }

  render() {
    return (
      <View>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step1")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step1_text")}</PText>
        <OptionButton
          title={i18n.t("kyc_label.passport")}
          handler={() => this.setID("passport")}
          child={
            <IDImg
              source={
                this.state.idType === "passport"
                  ? CheckedPassportPng
                  : PassportPng
              }
            />
          }
          checked={
            this.state.idType === "passport" ? (
              <Checked source={CheckedPng} />
            ) : (
              { "": "" }
            )
          }
        />
        <OptionButton
          title={i18n.t("kyc_label.drivers_license")}
          handler={() => this.setID("drivers")}
          child={
            <IDImg
              source={
                this.state.idType === "drivers" ? CheckedDriverPng : DriverPng
              }
            />
          }
          checked={
            this.state.idType === "drivers" ? (
              <Checked source={CheckedPng} />
            ) : (
              { "": "" }
            )
          }
        />
        <OptionButton
          title={i18n.t("kyc_label.id_card")}
          handler={() => this.setID("idCard")}
          child={
            <IDImg
              source={
                this.state.idType === "idCard" ? CheckedIDCardPng : IDCardPng
              }
            />
          }
          checked={
            this.state.idType === "idCard" ? (
              <Checked source={CheckedPng} />
            ) : (
              { "": "" }
            )
          }
        />
        <SubmitButton title={i18n.t("kyc_label.shoot")} handler={() => {}} />
      </View>
    );
  }
}

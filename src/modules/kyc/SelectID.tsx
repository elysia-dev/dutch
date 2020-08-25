import React, { Component } from "react";
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
import { NavigationScreenProp } from "react-navigation";
import { page } from "./Kyc";

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

interface props {
  navigation: NavigationScreenProp<any>;
}

interface state {
  idType: string;
}

export class SelectID extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { idType: "" };
  }

  setID(text: string) {
    this.state.idType != text
      ? this.setState({ idType: text })
      : this.setState({ idType: "" });
  }

  // navigation = useNavigation();

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ backgroundColor: "#fff", height: "100%" }}>
        <BackButton handler={() => navigation.goBack()} />
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
              <View />
            )
          }
        />
        <OptionButton
          title={i18n.t("kyc_label.drivers_license")}
          handler={() => this.setID("drivers_license")}
          child={
            <IDImg
              source={
                this.state.idType === "drivers_license"
                  ? CheckedDriverPng
                  : DriverPng
              }
            />
          }
          checked={
            this.state.idType === "drivers_license" ? (
              <Checked source={CheckedPng} />
            ) : (
              <View />
            )
          }
        />
        <OptionButton
          title={i18n.t("kyc_label.id_card")}
          handler={() => this.setID("id_card")}
          child={
            <IDImg
              source={
                this.state.idType === "id_card" ? CheckedIDCardPng : IDCardPng
              }
            />
          }
          checked={
            this.state.idType === "id_card" ? (
              <Checked source={CheckedPng} />
            ) : (
              <View />
            )
          }
        />
        <SubmitButton
          title={i18n.t("kyc_label.shoot")}
          handler={() => {
            if (this.state.idType === "") {
              alert("신분증을 선택해주세요");
            } else {
              navigation.navigate(page.TakeID, { idType: this.state.idType });
            }
          }}
        />
      </View>
    );
  }
}

import React, { Component } from "react";
import { View } from "react-native";
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
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { KycPage } from "../../enums/pageEnum";

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
  route: NavigationRoute;
}

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
    const { route, navigation } = this.props;
    // const { email, token } = route.params;
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
          title={i18n.t("kyc_label.government_id")}
          handler={() => this.setID("government_id")}
          child={
            <IDImg
              source={
                this.state.idType === "government_id"
                  ? CheckedIDCardPng
                  : IDCardPng
              }
            />
          }
          checked={
            this.state.idType === "government_id" ? (
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
              alert(i18n.t("kyc.alert_id"));
            } else {
              navigation.navigate(KycPage.TakeID, {
                // email: email,
                // token: token,
                id_type: this.state.idType,
              });
            }
          }}
        />
      </View>
    );
  }
}

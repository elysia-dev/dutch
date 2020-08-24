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

interface props {
  idType: string;
  setIdHandler: (id: string) => void;
}

export const SelectID: FunctionComponent<props> = (props) => {
  return (
    <View>
      <BackButton handler={() => {}} />
      <H1Text>{i18n.t("kyc.kyc_step1")}</H1Text>
      <PText>{i18n.t("kyc.kyc_step1_text")}</PText>
      <OptionButton
        title={i18n.t("kyc_label.passport")}
        handler={() => props.setIdHandler("passport")}
        child={
          <IDImg
            source={
              props.idType === "passport" ? CheckedPassportPng : PassportPng
            }
          />
        }
        checked={
          props.idType === "passport" ? (
            <Checked source={CheckedPng} />
          ) : (
            { "": "" }
          )
        }
      />
      <OptionButton
        title={i18n.t("kyc_label.drivers_license")}
        handler={() => props.setIdHandler("drivers_license")}
        child={
          <IDImg
            source={
              props.idType === "drivers_license" ? CheckedDriverPng : DriverPng
            }
          />
        }
        checked={
          props.idType === "drivers_license" ? (
            <Checked source={CheckedPng} />
          ) : (
            { "": "" }
          )
        }
      />
      <OptionButton
        title={i18n.t("kyc_label.id_card")}
        handler={() => props.setIdHandler("id_card")}
        child={
          <IDImg
            source={props.idType === "id_card" ? CheckedIDCardPng : IDCardPng}
          />
        }
        checked={
          props.idType === "id_card" ? (
            <Checked source={CheckedPng} />
          ) : (
            { "": "" }
          )
        }
      />
      <SubmitButton title={i18n.t("kyc_label.shoot")} handler={() => {}} />
    </View>
  );
};

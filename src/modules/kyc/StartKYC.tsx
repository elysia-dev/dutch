import React, { FunctionComponent, useState } from "react";
import { View, Text } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import ClockPng from "./images/clock.png";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KycPage } from "../../enums/pageEnum";
import { SafeAreaView } from "react-native-safe-area-context";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin: 40px 5% 6px 5%;
`;
const ClockImg = styled.Image`
  width: 13px;
  height: 13px;
  margin-right: 10px;
`;
const Circle = styled.Text`
  width: 26px;
  height: 26px;
  background-color: #3679b5;
  border-radius: 13px;
  color: #fff;
  line-height: 25px;
  text-align: center;
  overflow: hidden;
`;
const CircleWrapper = styled.View`
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 50px;
  font-size: 13px;
`;
const CircleText = styled.Text`
  position: absolute;
  color: #1c1c1c;
  font-size: 14px;
  margin-left: 36px;
  margin-top: 3px;
  margin-bottom: 42px;
`;
const HrLine = styled.View`
  position: absolute;
  height: 175px;
  border-left-width: 1px;
  border-left-color: #3679b5;
  left: 12px;
  margin-left: 5%;
`;
const KycGuideWrapper = styled.View`
  position: relative;
`;

export const StartKYC: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    agree: false,
  });
  return (
    <View
      style={{
        paddingTop: 40,
        flexDirection: "column",
        flex: 1,
      }}
    >
      <BackButton
        handler={() => {
          navigation.goBack();
        }}
        style={{ marginLeft: "5%" }}
      />
      <H1Text>{i18n.t("kyc.start_kyc")}</H1Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        <ClockImg
          source={ClockPng}
          style={{ marginTop: 2, resizeMode: "center" }}
        />
        <Text>{i18n.t("kyc.start_kyc_text")}</Text>
      </View>
      <KycGuideWrapper style={{ marginTop: 20 }}>
        <HrLine />
        <CircleWrapper>
          <Circle>1</Circle>
          <CircleText>{i18n.t("kyc.start_kyc_step1")}</CircleText>
        </CircleWrapper>
        <CircleWrapper>
          <Circle>2</Circle>
          <CircleText>{i18n.t("kyc.start_kyc_step2")}</CircleText>
        </CircleWrapper>
        <CircleWrapper>
          <Circle>3</Circle>
          <CircleText>{i18n.t("kyc.start_kyc_step3")}</CircleText>
        </CircleWrapper>
      </KycGuideWrapper>
      <View style={{ marginTop: "auto", marginBottom: 10 }}>
        <SubmitButton
          title={i18n.t("kyc_label.argos_terms")}
          handler={() =>
            navigation.navigate(KycPage.Argos, {
              agree: state.agree,
              updateAgree: (input: boolean) => setState({ agree: input }),
            })
          }
          ButtonTheme={"WhiteTheme"}
          style={{ marginBottom: 10 }}
        />
        <SubmitButton
          title={i18n.t("kyc_label.agree_start")}
          handler={() =>
            state.agree === false
              ? alert(i18n.t("kyc.argos"))
              : navigation.navigate(KycPage.SelectID)
          }
          ButtonTheme={state.agree === false ? "GrayTheme" : undefined}
        />
      </View>
    </View>
  );
};

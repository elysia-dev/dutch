import React, { Component } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import SelfieBeforePng from "./images/selfiebefore.png";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import { KycPage } from "../../enums/pageEnum";
import i18n from "../../i18n/i18n";
import { ScrollView } from "react-native-gesture-handler";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 40px;
  margin-left: 5%;
  margin-bottom: 6px;
`;
const PText = styled.Text`
  color: #626368;
  font-size: 13px;
  margin: 0px 5%;
  margin-bottom: 42px;
`;
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  width: 90%;
  height: 206px;
  left: 5%;
  border-radius: 13px;
  border: solid 2px #d0d8df;
  margin-bottom: 23px;
`;
const Selfie = styled.Image`
  width: 212px;
  height: 195px;
  margin: 9px auto 0px auto;
`;
const TakeSelfieBeforeWrapper = styled.SafeAreaView`
  padding-top: 25px;
  flex: 1;
  background-color: #ffffff;
`;
const InformationWrapper = styled.View`
  margin-left: 5%;
`;
const InformationText = styled.Text`
  font-size: 14px;
  color: #1c1c1c;
  margin-top: 15px;
`;
const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
`;

interface props {
  // handler: () => void;
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface state { }
//modal state 때문에 class로
export class TakeSelfieBefore extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  render() {
    const { route, navigation } = this.props;
    const { id_type, photoId } = route.params;
    return (
      <TakeSelfieBeforeWrapper>
        <ScrollView>
          <BackButton handler={() => navigation.navigate(KycPage.TakeSelfie)} />
          <H1Text>{i18n.t("kyc.kyc_step2")}</H1Text>
          <PText>{i18n.t("kyc.kyc_step2_text")}</PText>
          <Container>
            <Selfie source={SelfieBeforePng} />
          </Container>
          <InformationWrapper>
            <InformationText>
              <InformationCircle /> {i18n.t("kyc.kyc_step2_desc1")}
            </InformationText>
            <InformationText>
              <InformationCircle /> {i18n.t("kyc.kyc_step2_desc2")}
            </InformationText>
          </InformationWrapper>
        </ScrollView>
        <SubmitButton
          title={i18n.t("kyc_label.shoot")}
          handler={() =>
            navigation.navigate(KycPage.TakeSelfie, {
              id_type: id_type,
              // photoId_hash: photoId_hash,
              photoId: photoId,
            })
          }
        />
      </TakeSelfieBeforeWrapper>
    );
  }
}

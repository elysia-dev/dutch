import React, { Component } from "react";
import { Text, View } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import SelfieBeforePng from "./images/selfiebefore.png";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import { page } from "./Kyc";

import i18n from "../../i18n/i18n";
import { ScrollView } from "react-native-gesture-handler";

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
  height: 206px;
  left: 5%;
  border-radius: 13px;
  border: solid 2px #d0d8df;
`;
const Selfie = styled.Image`
  position: relative;
  width: 343px;
  height: 206px;
`;

interface props {
  // handler: () => void;
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface state {}
//modal state 때문에 class로
export class TakeSelfieBefore extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  render() {
    const { route, navigation } = this.props;
    const { id_type, photoId_hash, photoId } = route.params;
    return (
      <View style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          <BackButton handler={() => navigation.navigate(page.TakeSelfie)} />
          <H1Text>{i18n.t("kyc.kyc_step2")}</H1Text>
          <PText>{i18n.t("kyc.kyc_step2_text")}</PText>
          <Container>
            <Selfie source={SelfieBeforePng} />
          </Container>
          <Text>{i18n.t("kyc.kyc_step2_desc1")}</Text>
          <Text>{i18n.t("kyc.kyc_step2_desc2")}</Text>
          <SubmitButton
            title={i18n.t("kyc_label.shoot")}
            handler={() =>
              navigation.navigate(page.TakeSelfie, {
                id_type: id_type,
                photoId_hash: photoId_hash,
                photoId: photoId,
              })
            }
          />
        </ScrollView>
      </View>
    );
  }
}

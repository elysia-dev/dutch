import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import AcceptedImg from "./images/accepted.png";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";
import { SafeAreaView } from "react-native-safe-area-context";

const CurrentPasswordWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "41px" : "16px"};
  height: 100%;
  background-color: #fff;
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;
const Accepted = styled.Image`
  width: 64px;
  height: 60px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  password: string;
}

export class CurrentPassword extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      password: "",
    };
  }

  render() {
    const { route, navigation } = this.props;

    return (
      <CurrentPasswordWrapper>
        <BackButton handler={() => navigation.goBack()} />
        <H1Text>비밀번호 변경</H1Text>
        <H1Text>{i18n.t("account_check.insert_current_password")}</H1Text>

        <TextInput
          type={i18n.t("account_label.current_password")}
          edit={true}
          eventHandler={(input: string) => this.setState({ password: input })}
          value={""}
          secure={true}
        />

        <SubmitButton
          title={i18n.t("account_label.continue")}
          handler={() =>
            navigation.navigate(AccountPage.ResetPassword, {
              currentPassword: this.state.password,
            })
          }
        />
      </CurrentPasswordWrapper>
    );
  }
}

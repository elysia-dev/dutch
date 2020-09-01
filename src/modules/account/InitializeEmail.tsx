import React, { Component } from "react";
import { Text, SafeAreaView } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";

const InitializeEmailWrapper = styled.SafeAreaView`
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

interface props {
  navigation: NavigationScreenProp<any>;
}

interface state {
  email: string;
}

export class InitializeEmail extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { email: "" };
  }

  setEmail(input: string) {
    this.setState({ email: input });
  }

  callEmailApi() {
    if (!this.state.email) {
      alert(i18n.t("checking_account.insert_account_email"));
      return;
    }
    const { navigation } = this.props;

    Api.initializeEmail(this.state.email)
      .then((res) => {
        navigation.navigate(
          res.data.status == "exist"
            ? AccountPage.Login
            : AccountPage.CertifySignup,
          {
            verificationId: res.data.verificationId,
            email: this.state.email,
          }
        );
      })
      .catch((e) => {
        alert(i18n.t("checking_account.try_again_later"));
      });
  }

  render() {
    return (
      <InitializeEmailWrapper>
        <H1Text>{i18n.t("checking_account.insert_account_email")}</H1Text>
        <TextInput
          type={i18n.t("account_label.account_email")}
          value={""}
          eventHandler={(input: string) => {
            this.setState({ email: input });
          }}
          edit={true}
          secure={false}
        />
        <SubmitButton
          title={i18n.t("account_label.continue")}
          handler={() => this.callEmailApi()}
        />
      </InitializeEmailWrapper>
    );
  }
}

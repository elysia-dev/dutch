import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import LockAccountPng from "./images/lockaccount.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";

const LockAccountImg = styled.Image`
  width: 209px;
  height: 198px;
  margin: 25px auto;
`;
const LockAccountWrapper = styled.SafeAreaView`
  height: 100%;
  background-color: #fff;
`;
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
const LockAccountTextInput = styled.TextInput`
  margin-top: 30px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  code: string;
  verificationId: string;
}

export class LockAccount extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { code: "", verificationId: "" };
    this.setCode = this.setCode.bind(this);
  }

  setCode(input: string) {
    this.setState({ code: input });
    console.log(this.state.code);
  }

  callResendApi() {
    const { route } = this.props;
    const { email } = route.params;
    Api.certifyEmail_recover(email, "recoverAccount")
      .then((res) => this.setState({ verificationId: res.data.verificationId }))
      .catch((e) => alert(i18n.t("checking_account.try_again_later")));
  }

  callCertifyApi() {
    const { route, navigation } = this.props;
    const { email, verificationId } = route.params;
    if (!this.state.code) {
      alert(i18n.t("register.authentication_recover"));
      return;
    }
    Api.certifyEmail(
      this.state.verificationId === ""
        ? verificationId
        : this.state.verificationId,
      this.state.code
    )
      .then((res) => {
        if (res.data.status === "completed") {
          navigation.navigate(AccountPage.RecoverPassword, {
            verificationId:
              this.state.verificationId === ""
                ? verificationId
                : this.state.verificationId,
            email: email,
          });
        } else if (res.data.status === "expired") {
          alert(i18n.t("register.expired_verification"));
          return;
        } else {
          alert(
            i18n.t("register.unmatched_verification", {
              error: res.data.counts,
            })
          );
        }
      })
      .catch((e) => {});
  }

  render() {
    return (
      <LockAccountWrapper>
        <LockAccountImg source={LockAccountPng} />
        <H1Text>{i18n.t("lock_account.lockdown")}</H1Text>
        <PText>{i18n.t("lock_account.lockdown_text")}</PText>
        <TextInput
          type={i18n.t("account_label.authentication_code")}
          value=""
          edit={true}
          eventHandler={this.setCode}
          secure={false}
        />
        <Text>{i18n.t("lock_account.resending_code_mail_label")}</Text>
        <FlatButton
          handler={() => this.callResendApi()}
          title={i18n.t("account_label.resend_2")}
        />
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.callCertifyApi()}
        />
      </LockAccountWrapper>
    );
  }
}

const styles = StyleSheet.create({});

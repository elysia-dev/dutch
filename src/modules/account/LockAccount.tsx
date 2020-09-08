import React, { Component } from "react";
import { StyleSheet, Text, Platform } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import LockAccountPng from "./images/lockaccount.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";

const LockAccountWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "41px" : "16px"};
  height: 100%;
  background-color: #fff;
`;
const LockAccountImg = styled.Image`
  width: 209px;
  margin: 20px auto 5px auto;
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 13px;
  color: #626368;
  text-align: left;
  margin: 5px auto 16px auto;
  width: 90%;
`;
const ButtonWrapper = styled.View`
  flex-direction: row-reverse;
  width: 90%;
  margin: 0 auto;
`;
const FlatButtonWrapper = styled.View`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #36a1ff;
  color: #1c1c1c;
  width: 120px;
  height: 29px;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 2%;
  margin-bottom: 42px;
  line-height: 28px;
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
          autoFocus={true}
        />

        <ButtonWrapper>
          <FlatButtonWrapper>
            <FlatButton
              handler={() => this.callResendApi()}
              title={i18n.t("account_label.resend_2")}
            />
          </FlatButtonWrapper>
          <ExpTimeText>
            {i18n.t("lock_account.resending_code_mail_label")}
          </ExpTimeText>
        </ButtonWrapper>

        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.callCertifyApi()}
        />
      </LockAccountWrapper>
    );
  }
}

const styles = StyleSheet.create({});

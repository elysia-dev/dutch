import React, { Component, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  SafeAreaView,
} from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/account";
import { AccountPage } from "../../enums/pageEnum";

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

interface props {
  existence: string;
  certified: string;
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  code: string;
  verificationId: string;
}

export class CertifySignup extends Component<props, state> {
  api: any;
  constructor(props: props) {
    super(props);
    this.state = { code: "", verificationId: "" };
    this.setCode = this.setCode.bind(this);
    this.api = new Api();
  }

  setCode(input: string) {
    this.setState({ code: input });
    console.log(this.state.code);
  }

  callResendApi() {
    const { route, navigation } = this.props;
    const { email } = route.params;
    Api.initializeEmail(email)
      .then((res) => this.setState({ verificationId: res.data.verificationId }))
      .catch((e) => {
        alert(i18n.t("register.try_again_later"));
      });
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
          navigation.navigate(AccountPage.Signup, {
            email: email,
            verificationId:
              this.state.verificationId === ""
                ? verificationId
                : this.state.verificationId,
          });
        } else if (res.data.status === "expired") {
          alert(i18n.t("register.expired_verification"));
          return;
          //   navigation.navigate(AccountPage.InitializeEmail);
        } else {
          alert(
            i18n.t("register.unmatched_verification", {
              error: res.data.counts,
            })
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t("register.authentication_recover"));
          return;
        } else if (e.response.status === 404) {
          alert(i18n.t("register.expired_verification"));
          navigation.navigate(AccountPage.InitializeEmail);
        }
      });
  }

  render() {
    const { route, navigation } = this.props;
    const { email, status, verificationId } = route.params;
    //render 될 때마다 verificationId는 이전 route에서 받은 값으로 설정되나? 어떻게 update?
    return (
      <SafeAreaView
        style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}
      >
        <BackButton
          handler={() => navigation.navigate(AccountPage.InitializeEmail)}
        />
        <H1Text>{i18n.t("register.authentication_signup")}</H1Text>
        <Text>{i18n.t("register.authentication_signup_label")}</Text>
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          value={email}
          eventHandler={() => {}}
          secure={false}
        />
        <TextInput
          type={i18n.t("account_label.authentication_code")}
          edit={true}
          value={""}
          eventHandler={this.setCode}
          secure={false}
        />
        {this.props.certified === "pending" && (
          <Text>
            {i18n.t("errors.messages.authentication_code_do_not_match")}
          </Text>
        )}
        <Text>
          {i18n.t("register.expiration_time")} {}
        </Text>
        <FlatButton
          title={i18n.t("account_label.resend")}
          handler={() => this.callResendApi()}
        />
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.callCertifyApi()}
        />
      </SafeAreaView>
    );
  }
}

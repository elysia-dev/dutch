import React, { Component, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  SafeAreaView,
  Platform,
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
import WarningImg from "../../../src/shared/assets/images/warning.png";

const CertifySignupWrapper = styled.SafeAreaView`
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
  color: #1c1c1c;
  font-size: 13px;
  margin: 0px 5%;
  margin-bottom: 42px;
`;
const FlatButtonWrapper = styled.View`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #36a1ff;
  color: #1c1c1c;
  width: 76px;
  height: 29px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row-reverse;
  width: 90%;
  margin: 0 auto;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 2%;
  margin-bottom: 42px;
  line-height: 28px;
`;
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  top: 1px;
  position: absolute;
`;
const WarningText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 5px;
  line-height: 29px;
  flex-direction: row;
  flex: 10;
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
      <CertifySignupWrapper>
        <BackButton
          handler={() => navigation.navigate(AccountPage.InitializeEmail)}
        />
        <H1Text>{i18n.t("register.authentication_signup")}</H1Text>
        <PText>{i18n.t("register.authentication_signup_label")}</PText>
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
        <ButtonWrapper>
          <FlatButtonWrapper>
            <FlatButton
              title={i18n.t("account_label.resend")}
              handler={() => this.callResendApi()}
            />
          </FlatButtonWrapper>
          <ExpTimeText>03:00</ExpTimeText>
          <ExpTimeText>{i18n.t("register.expiration_time")}</ExpTimeText>
          {this.props.certified === "pending" && (
            <WarningText>
              <WarningIcon source={WarningImg} resizeMode={"center"} />{" "}
              {i18n.t("errors.messages.authentication_code_do_not_match")}
            </WarningText>
          )}
        </ButtonWrapper>

        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.callCertifyApi()}
        />
      </CertifySignupWrapper>
    );
  }
}

import React, { Component, useRef } from "react";
import { StyleSheet, Text, View, TextInput as RNTextInput, SafeAreaView } from "react-native";
import { TextInput } from "../../../shared/components/TextInput";
import { BackButton } from "../../../shared/components/BackButton";
import { SubmitButton } from "../../../shared/components/SubmitButton";
import { FlatButton } from "../../../shared/components/FlatButton";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../../api/account";
import { AccountPage } from "../../../enums/pageEnum";

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

export class CertifyEmail extends Component<props, state> {
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

  render() {
    const { route, navigation } = this.props;
    const { email, status, verificationId } = route.params;
    //render 될 때마다 verificationId는 이전 route에서 받은 값으로 설정되나? 어떻게 update?
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}>
        <BackButton handler={() => navigation.navigate(AccountPage.InitializeEmail)} />
        <H1Text>
          {status == "new"
            ? i18n.t("register.authentication_signup")
            : i18n.t("register.authentication_recover")}
        </H1Text>
        <Text>
          {status == "new"
            ? i18n.t("register.authentication_signup_label")
            : i18n.t("register.authentication_recover_label")}
        </Text>
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          value={email}
          eventHandler={() => { }}
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
          handler={() =>
            status == "new"
              ? Api.initializeEmail(email)
                .then((res) =>
                  this.setState({ verificationId: res.data.verificationId })
                )
                .catch((e) => {
                  alert(i18n.t("register.authentication_error"));
                })
              : Api.certifyEmail_recover(email, "Password")
                .then((res) => {
                  this.setState({ verificationId: res.data.verificationId });
                })
                .catch((e) => { })
          }
        />
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => {
            if (!this.state.code) {
              alert("인증번호를 입력해주세요");
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
                  navigation.navigate(
                    status === "new" ? AccountPage.Signup : AccountPage.ChangePassword,
                    {
                      email: email,
                      verificationId:
                        this.state.verificationId === ""
                          ? verificationId
                          : this.state.verificationId,
                    }
                  );
                } else if (res.data.status === "expired") {
                  navigation.navigate(AccountPage.InitializeEmail);
                } else {
                  alert(`인증번호가 올바르지 않아요. (${res.data.counts}/5)`)
                }
              })
              .catch((e) => { })
          }
          }
        />
      </SafeAreaView>
    );
  }
}

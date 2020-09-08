import React, { Component } from "react";
import { Text, SafeAreaView, Platform } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";

const InitializeEmailWrapper = styled.SafeAreaView`
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

interface props {
  navigation: NavigationScreenProp<any>;
}

interface state {
  email: string;
  errorLength: number;
  errorReg: number;
}

const CheckMailForm = function(input1: string) {
  // 이메일 주소 검증 정규표현식입니다.
  var regMail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return !regMail.test(input1) ? false : true;
};

export class InitializeEmail extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      email: "",
      errorLength: 1, // 처음은 TextInput이 null이기 때문에 없음을 가정
      errorReg: 0,
    };
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
        console.error(e);
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
            this.setState({
              email: input,
              errorLength: input.length == 0 ? 1 : 0,
              errorReg: CheckMailForm(input) ? 0 : 1,
            });
          }}
          edit={true}
          secure={false}
          autocapitalize={"none"}
        />
        {this.state.errorLength == 1 && (
          <SubmitButton
            title={"이메일을 입력해주세요"}
            handler={() => {}}
            ButtonTheme={"GrayTheme"}
          />
        )}
        {this.state.errorLength == 0 && this.state.errorReg == 1 && (
          <SubmitButton
            title={"이메일 주소를 확인해주세요"}
            handler={() => {}}
            ButtonTheme={"GrayTheme"}
          />
        )}
        {this.state.errorLength == 0 && this.state.errorReg == 0 && (
          <SubmitButton
            title={i18n.t("account_label.continue")}
            handler={() => this.callEmailApi()}
          />
        )}
      </InitializeEmailWrapper>
    );
  }
}

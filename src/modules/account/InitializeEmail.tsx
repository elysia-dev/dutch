import React, { Component } from "react";
import { View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp } from "react-navigation";
import { AccountPage } from "../../enums/pageEnum";
import AccountLayout from "../../shared/components/AccountLayout";
import checkMail from "../../utiles/checkMail";

const H1Text = styled.Text`
font-size: 20px;
color: #1c1c1c;
text-align: left;
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

export class InitializeEmail extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      email: "",
      errorLength: 1, // 처음은 TextInput이 null이기 때문에 없음을 가정
      errorReg: 0,
    };
  }

  callEmailApi = () => {
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
      <AccountLayout
        title={
          <H1Text>{i18n.t("checking_account.insert_account_email")}</H1Text>
        }
        body={
          <TextInput
            type={i18n.t("account_label.account_email")}
            value={""}
            eventHandler={(input: string) => {
              this.setState({
                email: input,
                errorLength: input.length == 0 ? 1 : 0,
                errorReg: checkMail(input) ? 0 : 1,
              });
            }}
            edit={true}
            secure={false}
            placeHolder="example@elysia.land"
          />
        }
        button={
          <SubmitButton
            title={
              this.state.errorLength == 1 ? "이메일을 입력해주세요" :
                this.state.errorReg == 1 ? "이메일 주소를 확인해주세요" :
                  i18n.t("account_label.continue")
            }
            handler={() => this.callEmailApi()}
            ButtonTheme={this.state.errorLength === 1 || this.state.errorReg === 1 ? "GrayTheme" : undefined}
          />
        }
      />
    );
  }
}

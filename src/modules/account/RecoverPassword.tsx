import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import { isRTL } from "expo-localization";

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
const Accepted = styled.Image`
  width: 64px;
  height: 60px;
`;

interface props {
  email: string;
  login: boolean;
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  step: number;
  password: string;
  passwordConfirmation: string;
  modalVisible: boolean;
}

export class RecoverPassword extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      step: 1,
      password: "",
      passwordConfirmation: "",
      modalVisible: false,
    };
    this.nextStep = this.nextStep.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  nextStep(number: number) {
    this.setState({ step: number });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
    console.log(this.state.modalVisible);
  };

  callChangeApi() {
    const { route, navigation } = this.props;
    const { verificationId } = route.params;

    if (this.state.password != this.state.passwordConfirmation) {
      alert(i18n.t("errors.messages.password_do_not_match"));
      return;
    } else if (this.state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
      return;
    } else {
      Api.recoverPassword(verificationId, this.state.password)
        .then((res) => {
          this.setModalVisible(true);
        })
        .catch((e) => {
          if (e.response.status === 400) {
            alert(i18n.t("recover_error"));
            this.setState({ step: 1 });
          } else if (e.reponse.status === 404) {
            alert(i18n.t("account_check.recover_verification_error"));
            navigation.navigate(AccountPage.InitializeEmail);
          }
        });
    }
  }

  render() {
    const { route, navigation } = this.props;
    const { email } = route.params;
    return (
      <SafeAreaView
        style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}
      >
        <BackButton handler={() => navigation.goBack()} />

        <H1Text>
          {this.state.step == 1
            ? i18n.t("account_check.recover_password")
            : i18n.t("account_check.password_confirm")}
        </H1Text>

        {this.state.step == 2 && (
          <TextInput
            type={i18n.t("account_label.account_password_confirm")}
            edit={true}
            eventHandler={(input: string) =>
              this.setState({ passwordConfirmation: input })
            }
            value={""}
            secure={true}
          />
        )}
        <TextInput
          type={i18n.t("account_label.account_password")}
          edit={this.state.step == 1 ? true : false}
          eventHandler={
            this.state.step == 1
              ? (input: string) => this.setState({ password: input })
              : () => {}
          }
          value={""}
          secure={true}
        />
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          eventHandler={() => {}}
          value={email}
          secure={false}
        />
        {this.state.step == 1 ? (
          <SubmitButton
            title={i18n.t("account_label.continue")}
            handler={() => {
              if (this.state.password === "") {
                alert(i18n.t("account_check.insert_password"));
                return;
              } else if (this.state.password.length < 8) {
                alert(i18n.t("errors.messages.password_too_short"));
                return;
              }
              this.nextStep(2);
            }}
          />
        ) : (
          <SubmitButton
            title={i18n.t("account_label.change")}
            handler={() => this.callChangeApi()}
          />
        )}
        {this.state.modalVisible === true && (
          <Modal
            child={
              <View>
                <Accepted source={AcceptedImg} />
                <H1Text>{i18n.t("account_check.password_changed")}</H1Text>
                <PText>{i18n.t("account_check.login_request")}</PText>
              </View>
            }
            modalHandler={() =>
              navigation.navigate(AccountPage.InitializeEmail, { email: "" })
            }
            visible={this.state.modalVisible}
          ></Modal>
        )}
      </SafeAreaView>
    );
  }
}

import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, SafeAreaView } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import WarningImg from "./images/warning.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { AccountPage } from "../../enums/pageEnum";
<<<<<<< HEAD
import WarningIcon from "../../../src/shared/assets/images/warning.png";
=======
import { Dashboard } from "../dashboard/Dashboard";
>>>>>>> origin/master

let lastError = 0;

const LoginWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "25px" : "0px"};
  height: 100%;
  z-index: 1;
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;
const WarningH1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 15px 5%;
  font-weight: bold;
`;
const WarningPText = styled.Text`
  color: #626368;
  margin-bottom: 15px;
  font-size: 13px;
  text-align: center;
`;
const WarningCount = styled.Text`
  color: #1c1c1c;
  margin-bottom: 40px;
  font-size: 13px;
  text-align: center;
`;
const Warning = styled.Image`
  width: 64px;
  height: 60px;
  margin: 10px auto;
`;
const WarningIconImg = styled.Image`
  width: 12px;
  height: 12px;
  top: 1px;
  position: absolute;
`;
const WarningText = styled.Text`
  font-size: 12px;
  color: #1c1c1c;
  text-align: right;
  margin: 10px 5%;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  modalVisible: boolean;
  error: number;
  password: string;
}

export class Login extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { modalVisible: false, error: 0, password: "" };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.activateModal = this.activateModal.bind(this);
    this.storeToken = this.storeToken.bind(this);
  }

  storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("@token", token);
    } catch (e) {
      console.error(e);
    }
  };

  setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
    console.log(this.state.modalVisible);
  };

  activateModal = () => {
    if (this.state.error == 0) {
      return this.state.modalVisible;
    } else if (this.state.error != lastError) {
      console.log(`lastError: ${lastError}`);
      console.log(`this.props.error: ${this.state.error}`);
      lastError = this.state.error;
      this.setState({ modalVisible: true });
      console.log(`finally: ${lastError}`);
    }
    return this.state.modalVisible;
  };

  callRecoverApi() {
    const { route, navigation } = this.props;
    const { email, status } = route.params;
    Api.certifyEmail_recover(email, "recoverPassword")
      .then((res) =>
        navigation.navigate(AccountPage.CertifyRecover, {
          email: email,
          verificationId: res.data.verificationId,
          status: status,
        })
      )
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t("checking_account.invalid_email"));
          return;
        } else {
          alert(i18n.t("checking_account.try_again_later"));
        }
      });
  }

  callLoginApi() {
    const { route, navigation } = this.props;
    const { email } = route.params;
    if (this.state.password === "") {
      alert(i18n.t("account_check.insert_password"));
      return;
    } else if (this.state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
      return;
    } else {
      Api.login(email, this.state.password)
        .then(async (res) => {
          console.log(res.data);
          //token local storage 저장
          if (res.data.status === "wrong") {
            this.setState({ error: res.data.counts });
          } else if (res.data.status === "locked") {
            navigation.navigate(AccountPage.LockAccount, {
              verificationId: res.data.verificationId,
              email: email,
            });
          } else if (res.data.status === "success") {
            await this.storeToken(res.data.token);
            navigation.navigate("Main");
          }
        })
        .catch((e) => {
          this.setState({ error: e.response.data.counts });
          if (e.response.status === 400) {
            alert(i18n.t("account_check.insert_password"));
          } else if (e.response.status === 404) {
            alert(i18n.t("errors.messages.wrong_email"));
          }
        });
    }
  }

  render() {
    const { route, navigation } = this.props;
    const { email } = route.params;
    return (
      <LoginWrapper>
        <View
          style={{
            top: 25,
            position: "absolute",
            height: "100%",
            width: "100%",
            zIndex: this.state.modalVisible === false ? 0 : 999,
            backgroundColor:
              this.state.modalVisible === false ? "#FFFFFF" : "#000000",
            display: this.state.modalVisible === false ? "none" : "flex",
            opacity: this.state.modalVisible === false ? 0 : 0.6,
          }}
        ></View>
        <BackButton
          handler={() => {
            navigation.goBack();
          }}
        />
        <H1Text>{i18n.t("account_check.insert_password")}</H1Text>
        <TextInput
          type={i18n.t("account_label.account_password")}
          value={""}
          edit={true}
          eventHandler={(input: string) => this.setState({ password: input })}
          secure={true}
        />
        {this.state.error > 0 && (
          <WarningText>
            <WarningIconImg source={WarningImg} />{" "}
            {i18n.t("errors.messages.password_do_not_match")} (
            {this.state.error}
            /5)
          </WarningText>
        )}
        <TextInput
          type={i18n.t("account_label.account_email")}
          value={email}
          edit={false}
          eventHandler={() => {}}
          secure={false}
        />
        <SubmitButton
          title={i18n.t("account_label.login")}
          handler={() => this.callLoginApi()}
          ButtonTheme={"WithFlat"}
        />
        <FlatButton
          title={i18n.t("account_check.forget_password_link")}
          handler={() => this.callRecoverApi()}
        />
        <View style={{ height: 15 }} />
        {this.activateModal() == true && (
          <Modal
            child={
              <View>
                <Warning source={WarningImg} />
                <WarningH1Text>
                  {i18n.t("errors.messages.password_do_not_match")}
                </WarningH1Text>
                <WarningPText>
                  {i18n.t("errors.messages.incorrect_password_warning")}
                </WarningPText>
                <WarningCount>({this.state.error}/5)</WarningCount>
              </View>
            }
            modalHandler={this.setModalVisible}
            visible={this.state.modalVisible}
          ></Modal>
        )}
      </LoginWrapper>
    );
  }
}
const styles = StyleSheet.create({});

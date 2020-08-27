import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import WarningImg from "./images/warning.png";
import { withNavigation } from "react-navigation";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { AccountPage } from "../../enums/pageEnum";

let lastError = 0;

const LoginWrapper = styled.SafeAreaView`
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
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;
const Warning = styled.Image`
  width: 64px;
  height: 60px;
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
    this.storeEmail = this.storeEmail.bind(this);
  }

  storeEmail = async (email: string) => {
    try {
      await AsyncStorage.setItem("@email", email);
    } catch (e) {
      console.error(e);
    }
  };

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

  render() {
    const { route, navigation } = this.props;
    const { email } = route.params;
    return (
      <LoginWrapper>
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
          <Text>
            {i18n.t("errors.messages.password_do_not_match")} (
            {this.state.error}
            /5)
          </Text>
        )}
        <TextInput
          type={i18n.t("account_label.account_email")}
          value={email}
          edit={false}
          eventHandler={() => { }}
          secure={false}
        />
        <SubmitButton
          title={i18n.t("account_label.login")}
          handler={() => {
            if (this.state.password === "") {
              alert(i18n.t("account_check.insert_password"));
            } else {
              Api.login(email, this.state.password)
                .then((res) => {
                  //token local storage 저장
                  if (res.data.status == "wrong") {
                    this.setState({ error: res.data.counts });
                  } else if (
                    res.data.counts >= 5 ||
                    res.data.status === "locked"
                  ) {
                    navigation.navigate(AccountPage.LockAccount, {
                      verificationId: res.data.verificationId,
                    });
                  } else if (res.data.status === "success") {
                    this.storeToken(res.data.token);
                    this.storeEmail(email);
                    navigation.navigate("Main", {
                      email: email,
                      password: this.state.password,
                    });
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
              //locked처리 해야함
            }
          }}
        />
        <FlatButton
          title={i18n.t("account_check.forget_password_link")}
          handler={() =>
            Api.certifyEmail_recover(email, "Password")
              .then()
              .catch()
          }
        />
        {this.activateModal() == true && (
          <Modal
            child={
              <View>
                <Warning source={WarningImg} />
                <H1Text>
                  {i18n.t("errors.messages.password_do_not_match")}
                </H1Text>
                <PText>
                  {i18n.t("errors.messages.incorrect_password_warning")}
                </PText>
                <Text>({this.state.error}/5)</Text>
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

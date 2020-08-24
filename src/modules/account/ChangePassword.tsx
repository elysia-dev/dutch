import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import AcceptedImg from "./images/accepted.png";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";

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
  passwordHandler: (input1: string, input2: string) => void;
  stageHandler: (text: string) => void;
  login: boolean;
}

interface state {
  step: number;
  input1: string;
  input2: string;
  modalVisible: boolean;
}

export class ChangePassword extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      step: 1,
      input1: "",
      input2: "",
      modalVisible: false,
    };
    this.nextStep = this.nextStep.bind(this);
    this.setInput1 = this.setInput1.bind(this);
    this.setInput2 = this.setInput2.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  nextStep(number: number) {
    this.setState({ step: number });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  setInput1(input: string) {
    this.setState({ input1: input });
    console.log(this.state.input1);
  } // 첫 비밀번호 인풋을 저장

  setInput2(input: string) {
    this.setState({ input2: input });
    console.log(this.state.input2);
  } // 비밀번호 확인 인풋을 저장

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
    console.log(this.state.modalVisible);
  };

  render() {
    return (
      <View>
        <BackButton handler={goToBack} />
        {this.props.login === true && (
          <View>
            <Text>비밀번호 변경</Text>
            <Text>
              {this.state.step == 1
                ? i18n.t("account_check.insert_password")
                : i18n.t("account_check.password_confirm")}
            </Text>
          </View>
        )}
        {this.props.login === false && (
          <Text>
            {this.state.step == 1
              ? i18n.t("account_check.recover_password")
              : i18n.t("account_check.password_confirm")}
          </Text>
        )}
        {this.state.step == 2 && (
          <TextInput
            type={i18n.t("account_label.account_password_confirm")}
            edit={true}
            eventHandler={this.setInput2}
            value={""}
            secure={true}
            //input1, input2 비교
          />
        )}
        <TextInput
          type={i18n.t("account_label.account_password")}
          edit={this.state.step == 1 ? true : false}
          eventHandler={this.state.step == 1 ? this.setInput1 : () => {}}
          value={""}
          secure={true}
        />
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          eventHandler={() => {}}
          value={this.props.email}
          secure={false}
        />
        {this.state.step == 1 ? (
          <SubmitButton
            title={i18n.t("account_label.continue")}
            handler={() => this.nextStep(2)}
          />
        ) : (
          <SubmitButton
            title={i18n.t("account_label.change")}
            handler={() => {
              this.setModalVisible(true);
              this.props.passwordHandler(this.state.input1, this.state.input2);
            }}
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
            modalHandler={() => this.props.stageHandler("Login")}
            visible={this.state.modalVisible}
          ></Modal>
        )}
      </View>
    );
  }
}

const goToBack = () => {};

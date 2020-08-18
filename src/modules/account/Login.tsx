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

let lastError = 0;

const LoginWrapper = styled.View`
  width: 375px;
  height: 811px;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요 나중에 제거
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
  email: string;
  password: string;
  stageHandler: (stage: string) => void;
  passwordHandler: (text: string) => void;
  findPassword: () => void;
  error: number;
}

interface state {
  modalVisible: boolean;
}

export class Login extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.navigation = this.props;
    this.goToBack = this.goToBack.bind(this);
    this.state = { modalVisible: false };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.activateModal = this.activateModal.bind(this);
  }

  goToBack() {}

  setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
    console.log(this.state.modalVisible);
  };

  activateModal = () => {
    if (this.props.error == 0) {
      return this.state.modalVisible;
    } else if (this.props.error != lastError) {
      console.log(`lastError: ${lastError}`);
      console.log(`this.props.error: ${this.props.error}`);
      lastError = this.props.error;
      this.setState({ modalVisible: true });
      console.log(`finally: ${lastError}`);
    }
    return this.state.modalVisible;
  };

  render() {
    return (
      <LoginWrapper>
        <BackButton
          handler={() => {
            // this.props.navigation.navigate({ routeName: "InitializeEmail" });
            this.props.navigation.goBack();
          }}
        />
        <H1Text>비밀번호를 입력해주세요.</H1Text>
        <TextInput
          type="비밀번호"
          value={""}
          edit={true}
          eventHandler={this.props.passwordHandler}
          secure={true}
        />
        {this.props.error > 0 && (
          <Text>비밀번호가 틀렸습니다. ({this.props.error}/5)</Text>
        )}
        <TextInput
          type="이메일"
          value={this.props.email}
          edit={false}
          eventHandler={() => {}}
          secure={false}
        />
        <SubmitButton
          title="로그인"
          handler={() => this.props.stageHandler(this.props.password)}
        />
        <FlatButton
          title="비밀번호를 잊으셨나요?"
          handler={this.props.findPassword}
        />
        {this.activateModal() == true && (
          <Modal
            child={
              <View>
                <Warning source={WarningImg} />
                <H1Text>비밀번호가 틀렸습니다</H1Text>
                <PText>5회 실패시 계정이 잠금되며 추가인증이 요구됩니다.</PText>
                <Text>({this.props.error}/5)</Text>
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

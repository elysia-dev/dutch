import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import KycSubmitPng from "./images/kycsubmit.png";

import i18n from "../../i18n/i18n";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
`;

interface props {}

interface state {
  modalVisible: boolean;
}

export class ConfirmSelfie extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { modalVisible: false };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
    console.log(this.state.modalVisible);
  };

  render() {
    return (
      <View>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("kyc.kyc_step3_complete")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step3_complete_text")}</PText>

        <SubmitButton
          title={i18n.t("kyc_label.shoot_again")}
          handler={() => {}}
        />
        <SubmitButton
          title={i18n.t("kyc_label.submit")}
          handler={() => {
            //서버로 리퀘스트 보내는 함수
            this.setModalVisible(true);
          }}
        />

        {this.state.modalVisible === true && (
          <Modal
            child={
              <View>
                <ConfirmImg source={KycSubmitPng} />
                <H1Text>{i18n.t("kyc.kyc_submit")}</H1Text>
                <PText>{i18n.t("kyc.kyc_submit_text")}</PText>
              </View>
            }
            visible={this.state.modalVisible}
            modalHandler={() => {
              this.setModalVisible(false);
            }}
            // 다시 더보기 페이지로 돌아가게끔!
          ></Modal>
        )}
      </View>
    );
  }
}

import React, { Component, useRef } from "react";
import { StyleSheet, Text, View, TextInput as RNTextInput } from "react-native";
import { TextInput } from "../../../shared/components/TextInput";
import { BackButton } from "../../../shared/components/BackButton";
import { SubmitButton } from "../../../shared/components/SubmitButton";
import { FlatButton } from "../../../shared/components/FlatButton";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";

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
  email: string;
  stageHandler: (input: string) => void;
  // stageHandler: () => void;
  resendHandler: () => void;
  existence: string;
  certified: string;
}

interface state {
  code: string;
}

export class CertifyEmail extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { code: "" };
    this.setCode = this.setCode.bind(this);
  }

  setCode(input: string) {
    this.setState({ code: input });
    console.log(this.state.code);
  }

  render() {
    return (
      <View>
        <BackButton handler={goToBack} />
        <H1Text>
          {this.props.existence == "new"
            ? i18n.t("register.authentication_signup")
            : i18n.t("register.authentication_recover")}
        </H1Text>
        <Text>
          {this.props.existence == "new"
            ? i18n.t("register.authentication_signup_label")
            : i18n.t("register.authentication_recover_label")}
        </Text>
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          value={this.props.email}
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
          handler={() => this.props.resendHandler}
        />
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.props.stageHandler(this.state.code)}
        />
      </View>
    );
  }
}

const goToBack = () => {};
// bind issue 없나?  보내줄 일이 없어서 ㄱㅊ
// 메서드가 다른 컴포넌트에서 사용되는 것이 아니라 이 certifyemail 컴포넌트가 호출되었을 때 사용되기 때문에
// 제대로 불러올 수 있는 것으로 ..!

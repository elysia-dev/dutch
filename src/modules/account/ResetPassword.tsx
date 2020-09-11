import React, { FunctionComponent, useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";

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

type ParamList = {
  ResetPassword: {
    currentPassword: string;
  };
};

const ResetPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    step: 1,
    password: "",
    passwordConfirmation: "",
  })

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "ResetPassword">>();

  const callChangeApi = () => {
    if (state.password != state.passwordConfirmation) {
      alert(i18n.t("errors.messages.password_do_not_match"));
      return;
    } else if (state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
      return;
    } else if (state.password == route.params.currentPassword) {
      alert(i18n.t("account_check.reset_current_same"));
      return;
    } else {
      Api.resetPassword(state.password, route.params.currentPassword)
        .then((res) => {
          // info페이지로 다시 돌아가게 해야함 !!
          if (res.data.status === "success") {
            alert(i18n.t("account_check.password_changed"));
          } else if (res.data.status === "wrong") {
            alert(i18n.t("account_check.reset_current_error"));
          } else if (res.data.status === "same") {
            alert(i18n.t("account_check.reset_current_same"));
          }
          navigation.navigate("Main", { screen: "Info" });
        })
        .catch((e) => {
          if (e.response.status === 400) {
            alert(i18n.t("account_check.reset_error"));
          } else if (e.response.status === 401) {
            alert(i18n.t("account_check.recover_verification_error"));
          }
          navigation.navigate("Main", { screen: "Info" });
        });
    }
  }

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => {
              state.step == 2 ? setState({ ...state, step: 1 }) : navigation.goBack();
            }}
            style={{ marginTop: 20, marginBottom: 20 }}
          />
          <View>
            <Text>비밀번호 변경</Text>
            <H1Text>
              {state.step == 1
                ? i18n.t("account_check.insert_new_password")
                : i18n.t("account_check.password_confirm")}
            </H1Text>
          </View>
        </>
      }
      body={
        <>
          {state.step == 2 && (
            <TextInput
              type={i18n.t("account_label.account_password_confirm")}
              edit={true}
              eventHandler={(input: string) =>
                setState({ ...state, passwordConfirmation: input })
              }
              value={""}
              secure={true}
            />
          )}
          <TextInput
            type={i18n.t("account_label.new_password")}
            edit={state.step == 1 ? true : false}
            eventHandler={
              state.step == 1
                ? (input: string) => setState({ ...state, password: input })
                : () => { }
            }
            value={""}
            secure={true}
          />
          {state.password === route.params.currentPassword && (
            <PText>{i18n.t("account_check.reset_current_same")}</PText>
          )}
          <TextInput
            type={i18n.t("account_label.current_password")}
            edit={false}
            eventHandler={() => { }}
            value={route.params.currentPassword}
            secure={true}
          />
        </>
      }
      button={
        <>
          {
            state.step == 1 ? (
              <SubmitButton
                title={i18n.t("account_label.continue")}
                handler={() => {
                  if (state.password === "") {
                    alert(i18n.t("account_check.insert_password"));
                    return;
                  }
                  setState({ ...state, step: 2 });
                }}
              />
            ) : (
                <SubmitButton
                  title={i18n.t("account_label.change")}
                  handler={() => callChangeApi()}
                />
              )
          }
        </>
      }
    />
  );
}

export default ResetPassword;
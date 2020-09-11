import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";
import ValidationMessage from "../../shared/components/ValidationMessage";
import checkPassword from "../../utiles/checkPassword";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  font-weight: bold;
`;

interface Iprops {
  email?: string
  submitHandler: (password: string) => void
  submitButtonTitle: string
  message1: string
  message2: string
}

const PasswordForm: FunctionComponent<Iprops> = (props) => {
  const [state, setState] = useState({
    step: 1,
    password: "",
    passwordConfirmation: "",
    errorLength: 0,
    errorReg: 0
  })

  const navigation = useNavigation();

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
          <H1Text>
            {
              state.step == 1
                ? props.message1
                : props.message2
            }
          </H1Text>
        </>
      }
      body={
        <>
          {
            state.step == 2 && (
              <>
                <TextInput
                  type={i18n.t("account_label.account_password_confirm")}
                  edit={true}
                  eventHandler={(input: string) => {
                    setState({
                      ...state,
                      passwordConfirmation: input,
                      errorLength: input !== state.password ? 2 : 0
                    });
                  }}
                  value={""}
                  secure={true}
                />
                <View style={{ height: 30 }}>
                  {state.step == 2 && state.errorLength == 2 && (
                    <ValidationMessage message={i18n.t("errors.messages.password_do_not_match")} />
                  )}
                </View>
              </>
            )
          }
          <TextInput
            type={i18n.t("account_label.account_password")}
            edit={state.step === 1}
            eventHandler={(input: string) => {
              setState({
                ...state,
                password: input,
                errorLength: input.length < 8 ? 1 : 0,
                errorReg: checkPassword(input) ? 0 : 1,
              });
            }}
            value={""}
            secure={true}
          />
          <View style={{ height: 30 }}>
            {
              state.errorLength == 1 && (
                <ValidationMessage message={i18n.t("errors.messages.password_too_short")} />
              )
            }
            {
              state.errorLength == 0 && state.errorReg == 1 && (
                <ValidationMessage message={i18n.t("errors.messages.simple_password")} />
              )
            }
          </View>
          {
            props.email && <TextInput
              type={i18n.t("account_label.account_email")}
              edit={false}
              eventHandler={() => { }}
              value={props.email}
              secure={false}
            />
          }
        </>
      }
      button={
        <>
          {
            state.step == 1 ? (
              <SubmitButton
                title={i18n.t("account_label.continue")}
                handler={() => {
                  if (state.password.length < 8) {
                    alert(i18n.t("errors.messages.password_too_short"));
                    return;
                  }
                  setState({ ...state, step: 2 });
                }}
                disabled={state.errorLength !== 0 || state.errorReg !== 0}
                ButtonTheme={state.errorLength === 1 || state.errorReg === 1 ? "GrayTheme" : undefined}
              />
            ) : (
                <SubmitButton
                  title={props.submitButtonTitle}
                  handler={() => props.submitHandler(state.password)}
                  disabled={!state.passwordConfirmation || state.errorLength !== 0 || state.errorReg !== 0}
                  ButtonTheme={(!state.passwordConfirmation || state.errorLength !== 0 || state.errorReg !== 0) ? "GrayTheme" : undefined}
                />
              )
          }
        </>
      }
    />
  );
}

export default PasswordForm;
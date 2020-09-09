import React, { useState, useContext } from "react";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import WarningImg from "../../../src/shared/assets/images/warning.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import UserContext from "../../contexts/UserContext";

const SignupWrapper = styled.SafeAreaView`
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
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin: 0px 5px;
  top: 1px;
  position: absolute;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #1c1c1c;
  text-align: right;
  margin: 10px 5%;
`;

const CheckPassword = function (input1: string) {
  // 숫자와 영문이 모두 있는지 검사하고 T/F return 하는 함수입니다.
  var reg_pwd = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
  return !reg_pwd.test(input1) ? false : true;
};

type ParamList = {
  Signup: {
    verificationId: string;
    email: string;
  }
}

const Signup = () => {
  const [state, setState] = useState({
    step: 1,
    password: "",
    passwordConfirmation: "",
    errorLength: 0,
    errorReg: 0,
  })
  const navigation = useNavigation();
  const { signIn } = useContext(UserContext);
  const route = useRoute<RouteProp<ParamList, 'Signup'>>();

  const nextStep = (input: number) => {
    setState({ ...state, step: input });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem("@token", token);
  };

  const callSignupApi = () => {
    if (state.password != state.passwordConfirmation) {
      alert(i18n.t("errors.messages.password_do_not_match"));
    } else if (state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
    } else {
      Api.signup(route.params.verificationId, state.password)
        .then(async (res) => {
          if (res.data.status === "success") {
            await storeToken(res.data.token);
            await signIn();
          }
        })
        .catch((e) => {
          alert(i18n.t("register.try_again_later"));
        });
    }
  }

  return (
    <SignupWrapper>
      <BackButton
        handler={() => {
          state.step == 2 ? nextStep(1) : navigation.goBack();
        }}
      />
      <H1Text>
        {state.step == 1
          ? i18n.t("account_check.insert_password")
          : i18n.t("account_check.password_confirm")}
      </H1Text>
      {state.step == 2 && (
        <TextInput
          type={i18n.t("account_label.account_password_confirm")}
          edit={true}
          eventHandler={(input: string) => {
            setState({
              ...state,
              passwordConfirmation: input,
              errorLength: input !== state.password ? 2 : 0,
            });
          }}
          value={""}
          secure={true}
        />
      )}
      {state.step == 2 && state.errorLength == 2 && (
        <PText>
          <WarningIcon source={WarningImg} />
          <PText> {i18n.t("errors.messages.password_do_not_match")}</PText>
        </PText>
      )}
      <TextInput
        type={i18n.t("account_label.account_password")}
        edit={state.step == 1 ? true : false}
        eventHandler={
          state.step == 1
            ? (input: string) => {
              setState({
                ...state,
                password: input,
                errorLength: input.length < 8 ? 1 : 0,
                errorReg: CheckPassword(input) ? 0 : 1,
              });
            }
            : () => { }
        }
        value={""}
        secure={true}
      />
      {state.errorLength == 1 && (
        <PText>
          <WarningIcon source={WarningImg} resizeMode={"center"} />
          <PText>{i18n.t("errors.messages.password_too_short")}</PText>
        </PText>
      )}
      {state.errorLength == 0 && state.errorReg == 1 && (
        <PText>
          <WarningIcon source={WarningImg} resizeMode={"center"} />
          {i18n.t("errors.messages.simple_password")}
        </PText>
      )}
      <TextInput
        type={i18n.t("account_label.account_email")}
        edit={false}
        eventHandler={() => { }}
        value={route.params.email}
        secure={false}
      />
      {state.step == 1 ? (
        <SubmitButton
          title={i18n.t("account_label.continue")}
          handler={() => {
            if (state.password.length < 8) {
              alert(i18n.t("errors.messages.password_too_short"));
              return;
            }
            nextStep(2);
          }}
        />
      ) : (
          <SubmitButton
            title={i18n.t("account_label.signup")}
            handler={() => callSignupApi()}
          />
        )}
    </SignupWrapper>
  );
}

export default Signup;
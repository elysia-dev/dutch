import React, { FunctionComponent, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import WarningImg from "./images/warning.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import { AccountPage } from "../../enums/pageEnum";
import UserContext from "../../contexts/UserContext";

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

type ParamList = {
  Login: {
    email: string;
  };
};

export const Login: FunctionComponent = () => {
  const [state, setState] = useState({
    modalVisible: false,
    error: 0,
    password: "",
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "Login">>();
  const { signIn } = useContext(UserContext);

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem("@token", token);
  };

  const setModalVisible = () => {
    setState({ ...state, modalVisible: !state.modalVisible });
  };

  const activateModal = () => {
    if (state.error == 0) {
      return state.modalVisible;
    } else if (state.error != lastError) {
      lastError = state.error;
      setState({ ...state, modalVisible: true });
    }
    return state.modalVisible;
  };

  const callRecoverApi = () => {
    Api.certifyEmail_recover(route.params.email, "recoverPassword")
      .then((res) =>
        navigation.navigate(AccountPage.CertifyRecover, {
          email: route.params.email,
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
  };

  const callLoginApi = () => {
    if (state.password === "") {
      alert(i18n.t("account_check.insert_password"));
      return;
    } else if (state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
      return;
    } else {
      Api.login(route.params.email, state.password)
        .then(async (res) => {
          console.log(res.data);
          //token local storage 저장
          if (res.data.status === "wrong") {
            setState({ ...state, error: res.data.counts });
          } else if (res.data.status === "locked") {
            navigation.navigate(AccountPage.LockAccount, {
              verificationId: res.data.verificationId,
              email: route.params.email,
            });
          } else if (res.data.status === "success") {
            await storeToken(res.data.token);
            await signIn();
          }
        })
        .catch((e) => {
          setState({ ...state, error: e.response.data.counts });
          if (e.response.status === 400) {
            alert(i18n.t("account_check.insert_password"));
          } else if (e.response.status === 404) {
            alert(i18n.t("errors.messages.wrong_email"));
          }
        });
    }
  };

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
        eventHandler={(input: string) =>
          setState({ ...state, password: input })
        }
        secure={true}
      />
      {state.error > 0 && (
        <Text>
          {i18n.t("errors.messages.password_do_not_match")} ({state.error}
          /5)
        </Text>
      )}
      <TextInput
        type={i18n.t("account_label.account_email")}
        value={route.params.email}
        edit={false}
        eventHandler={() => {}}
        secure={false}
      />
      <SubmitButton
        title={i18n.t("account_label.login")}
        handler={() => callLoginApi()}
      />
      <FlatButton
        title={i18n.t("account_check.forget_password_link")}
        handler={() => callRecoverApi()}
      />
      {activateModal() == true && (
        <Modal
          child={
            <View>
              <Warning source={WarningImg} />
              <H1Text>{i18n.t("errors.messages.password_do_not_match")}</H1Text>
              <PText>
                {i18n.t("errors.messages.incorrect_password_warning")}
              </PText>
              <Text>({state.error}/5)</Text>
            </View>
          }
          modalHandler={setModalVisible}
          visible={state.modalVisible}
        ></Modal>
      )}
    </LoginWrapper>
  );
};
const styles = StyleSheet.create({});

export default Login;

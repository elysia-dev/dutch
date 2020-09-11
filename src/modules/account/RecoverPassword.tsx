import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { Modal } from "../../shared/components/Modal";
import AcceptedImg from "./images/accepted.png";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { AccountPage } from "../../enums/pageEnum";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import PasswordForm from "./PasswordForm";

const Accepted = styled.Image`
  width: 64px;
  height: 60px;
  margin: 10px auto;
`;
const AcceptedH1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 15px 5%;
  font-weight: bold;
`;
const AcceptedPText = styled.Text`
  color: #626368;
  margin-bottom: 15px;
  font-size: 13px;
  text-align: center;
  margin-bottom: 40px;
`;

type ParamList = {
  RecoverPassword: {
    email: string;
    verificationId: string;
  };
}

const RecoverPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    modalVisible: false,
  })

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "RecoverPassword">>();

  const callChangeApi = (password: string) => {
    Api.recoverPassword(route.params.verificationId, password)
      .then(() => {
        setState({ modalVisible: true });
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t("recover_error"));
        } else if (e.reponse.status === 404) {
          alert(i18n.t("account_check.recover_verification_error"));
          navigation.navigate(AccountPage.InitializeEmail);
        }
      });
  }

  return (
    <View>
      <View
        style={{
          top: 25,
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: state.modalVisible === false ? 0 : 999,
          backgroundColor:
            state.modalVisible === false ? "#FFFFFF" : "#000000",
          display: state.modalVisible === false ? "none" : "flex",
          opacity: state.modalVisible === false ? 0 : 0.6,
        }}
      ></View>
      <PasswordForm
        submitButtonTitle={i18n.t("account_label.change")}
        submitHandler={callChangeApi}
        message1={i18n.t("account_check.insert_new_password")}
        message2={i18n.t("account_check.password_confirm")}
      />
      {state.modalVisible === true && (
        <Modal
          child={
            <View>
              <Accepted source={AcceptedImg} />
              <AcceptedH1Text>
                {i18n.t("account_check.password_changed")}
              </AcceptedH1Text>
              <AcceptedPText>
                {i18n.t("account_check.login_request")}
              </AcceptedPText>
            </View>
          }
          modalHandler={() =>
            navigation.navigate(AccountPage.InitializeEmail, { email: "" })
          }
          visible={state.modalVisible}
        ></Modal>
      )}
    </View>
  );
}

export default RecoverPassword;

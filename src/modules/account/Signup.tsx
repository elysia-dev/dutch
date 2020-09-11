import React, { FunctionComponent, useContext } from "react";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import AsyncStorage from "@react-native-community/async-storage";
import { useRoute, RouteProp } from "@react-navigation/native";
import UserContext from "../../contexts/UserContext";
import PasswordForm from "./PasswordForm";

type ParamList = {
  Signup: {
    verificationId: string;
    email: string;
  };
};

const Signup: FunctionComponent = () => {
  const { signIn } = useContext(UserContext);
  const route = useRoute<RouteProp<ParamList, "Signup">>();

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem("@token", token);
  };

  const callSignupApi = (password: string): void => {
    Api.signup(route.params.verificationId, password)
      .then(async (res) => {
        if (res.data.status === "success") {
          await storeToken(res.data.token);
          await signIn();
        }
      })
      .catch((e) => {
        alert(i18n.t("register.try_again_later"));
      });
  };

  return (
    <PasswordForm
      submitHandler={callSignupApi}
      email={route.params.email}
      submitButtonTitle={i18n.t("account_label.signup")}
      message1={i18n.t("account_check.new_password")}
      message2={i18n.t("account_check.password_confirm")}
    />
  );
}

export default Signup;
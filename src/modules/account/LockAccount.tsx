import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import BorderFlatButton from "../../shared/components/BorderFlatButton";
import styled from "styled-components/native";
import LockAccountPng from "./images/lockaccount.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { AccountPage } from "../../enums/pageEnum";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";

const LockAccountImg = styled.Image`
  width: 209px;
  height: 200px;
  margin: 20px auto 5px auto;
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 13px;
  color: #626368;
  text-align: left;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 2%;
  line-height: 21px;
  height: 21px;
`;

type ParamList = {
  LockAccount: {
    email: string;
    verificationId: string;
  };
};

const LockAccount: FunctionComponent = () => {
  const [state, setState] = useState({
    code: "",
    verificationId: "",
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "LockAccount">>();

  const callResendApi = () => {
    Api.certifyEmail_recover(route.params.email, "recoverAccount")
      .then((res) => {
        setState({ ...state, verificationId: res.data.verificationId });
        alert(i18n.t("register.resend_verification"));
      })
      .catch((e) => alert(i18n.t("checking_account.try_again_later")));
  };

  const callCertifyApi = () => {
    if (!state.code) {
      alert(i18n.t("register.authentication_recover"));
      return;
    }
    Api.certifyEmail(
      state.verificationId || route.params.verificationId,
      state.code
    )
      .then((res) => {
        if (res.data.status === "completed") {
          navigation.navigate(AccountPage.RecoverPassword, {
            verificationId: state.verificationId || route.params.verificationId,
            email: route.params.email,
          });
        } else if (res.data.status === "expired") {
          alert(i18n.t("register.expired_verification"));
          return;
        } else {
          alert(
            i18n.t("register.unmatched_verification", {
              error: res.data.counts,
            })
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert(i18n.t("resigter.expired_verification"));
        } else if (e.response.status === 500) {
          alert(i18n.t("errors.messages.server"));
        }
      });
  };

  return (
    <AccountLayout
      title={
        <>
          <LockAccountImg source={LockAccountPng} />
          <H1Text style={{ marginTop: 10 }}>
            {i18n.t("lock_account.lockdown")}
          </H1Text>
          <PText style={{ marginTop: 10 }}>
            {i18n.t("lock_account.lockdown_text")}
          </PText>
        </>
      }
      body={
        <>
          <TextInput
            type={i18n.t("account_label.authentication_code")}
            value=""
            edit={true}
            eventHandler={(value) => setState({ ...state, code: value })}
            secure={false}
            autoFocus={true}
          />
          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <ExpTimeText style={{ marginLeft: "auto" }}>
              {i18n.t("lock_account.resending_code_mail_label")}
            </ExpTimeText>
            <BorderFlatButton
              handler={() => callResendApi()}
              title={i18n.t("account_label.resend_2")}
            />
          </View>
        </>
      }
      button={
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => callCertifyApi()}
        />
      }
    />
  );
};

export default LockAccount;

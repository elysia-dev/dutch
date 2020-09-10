import React, { FunctionComponent, useState } from "react";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/account";
import { AccountPage } from "../../enums/pageEnum";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";
import ValidationMessage from "../../shared/components/ValidationMessage";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin: 0px 5%;
  margin-bottom: 42px;
`;

const FlatButtonWrapper = styled.View`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #36a1ff;
  color: #1c1c1c;
  width: 76px;
  height: 29px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row-reverse;
  width: 90%;
  margin: 0 auto;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 2%;
  margin-bottom: 42px;
  line-height: 28px;
`;

interface props {
  existence: string;
  certified: string;
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

type ParamList = {
  CertifyRecover: {
    email: string;
    verificationId: string;
  };
};

const CertifyRecover: FunctionComponent<props> = (props) => {
  const [state, setState] = useState({
    code: "", verificationId: ""
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "CertifyRecover">>();

  const callResendApi = () => {
    Api.certifyEmail_recover(route.params.email, "recoverPassword")
      .then((res) => {
        setState({ ...state, verificationId: res.data.verificationId });
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t("checking_account.invalid_email"));
          return;
        } else {
          alert(i18n.t("checking_account.try_again_later"));
        }
      });
  }

  const callCertifyApi = () => {
    if (!state.code) {
      alert(i18n.t("register.authentication_recover"));
      return;
    }
    Api.certifyEmail(
      state.verificationId === ""
        ? route.params.verificationId
        : state.verificationId,
      state.code
    )
      .then((res) => {
        if (res.data.status === "completed") {
          navigation.navigate(AccountPage.RecoverPassword, {
            email: route.params.email,
            verificationId:
              state.verificationId === ""
                ? route.params.verificationId
                : state.verificationId,
          });
        } else if (res.data.status === "expired") {
          alert(i18n.t("register.expired_verification"));
          return;
          //   navigation.navigate(AccountPage.InitializeEmail);
        } else {
          alert(
            i18n.t("register.unmatched_verification", {
              error: res.data.counts,
            })
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t("register.authentication_recover"));
          return;
        } else if (e.response.status === 404) {
          alert(i18n.t("register.expired_verification"));
          navigation.navigate(AccountPage.InitializeEmail);
        }
      });
  }

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => navigation.navigate(AccountPage.InitializeEmail)}
          />
          <H1Text>{i18n.t("register.authentication_recover")}</H1Text>
          <PText>{i18n.t("register.authentication_recover_label")}</PText>
        </>
      }
      body={
        <>
          <TextInput
            type={i18n.t("account_label.account_email")}
            edit={false}
            value={route.params.email}
            eventHandler={() => { }}
            secure={false}
          />
          <TextInput
            type={i18n.t("account_label.authentication_code")}
            edit={true}
            value={""}
            eventHandler={(value) => { setState({ ...state, code: value }) }}
            secure={false}
          />
        </>
      }
      button={
        <>
          <ButtonWrapper>
            <FlatButtonWrapper>
              <FlatButton
                title={i18n.t("account_label.resend")}
                handler={() => callResendApi()}
              />
            </FlatButtonWrapper>
            <ExpTimeText>03:00</ExpTimeText>
            <ExpTimeText>{i18n.t("register.expiration_time")}</ExpTimeText>
            {props.certified === "pending" && (
              <ValidationMessage message={i18n.t("errors.messages.authentication_code_do_not_match")} />
            )}
          </ButtonWrapper>
          <SubmitButton
            title={i18n.t("account_label.certify")}
            handler={() => callCertifyApi()}
          />
        </>
      }
    />
  );
}

export default CertifyRecover
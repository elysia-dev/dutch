import React, { FunctionComponent, useState } from "react";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { AccountPage } from "../../enums/pageEnum";
import AccountLayout from "../../shared/components/AccountLayout";
import checkMail from "../../utiles/checkMail";
import { useNavigation } from "@react-navigation/native";

const H1Text = styled.Text`
font-size: 20px;
color: #1c1c1c;
text-align: left;
font-weight: bold;
`;

const InitializeEmail: FunctionComponent = () => {
  const [state, setState] = useState({
    email: "",
    errorLength: 1, // 처음은 TextInput이 null이기 때문에 없음을 가정
    errorReg: 0,
  })

  const navigation = useNavigation();

  const callEmailApi = () => {
    if (!state.email) {
      alert(i18n.t("checking_account.insert_account_email"));
      return;
    }

    Api.initializeEmail(state.email)
      .then((res) => {
        navigation.navigate(
          res.data.status == "exist"
            ? AccountPage.Login
            : AccountPage.CertifySignup,
          {
            verificationId: res.data.verificationId,
            email: state.email,
          }
        );
      })
      .catch((e) => {
        console.error(e);
        alert(i18n.t("checking_account.try_again_later"));
      });
  }

  return (
    <AccountLayout
      title={
        <H1Text>{i18n.t("checking_account.insert_account_email")}</H1Text>
      }
      body={
        <TextInput
          type={i18n.t("account_label.account_email")}
          value={""}
          eventHandler={(input: string) => {
            setState({
              email: input,
              errorLength: input.length == 0 ? 1 : 0,
              errorReg: checkMail(input) ? 0 : 1,
            });
          }}
          edit={true}
          secure={false}
          placeHolder="example@elysia.land"
        />
      }
      button={
        <SubmitButton
          title={
            state.errorLength == 1 ? "이메일을 입력해주세요" :
              state.errorReg == 1 ? "이메일 주소를 확인해주세요" :
                i18n.t("account_label.continue")
          }
          handler={() => callEmailApi()}
          ButtonTheme={state.errorLength === 1 || state.errorReg === 1 ? "GrayTheme" : undefined}
        />
      }
    />
  );
}

export default InitializeEmail;
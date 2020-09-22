import React, { FunctionComponent, useState } from "react";
import { TextField } from "../../shared/components/TextField";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { AccountPage } from "../../enums/pageEnum";
import { useNavigation } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  font-weight: bold;
`;

const CurrentPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    password: "",
  });

  const navigation = useNavigation();

  return (
    <AccountLayout
      title={
        <>
          <BackButton handler={() => navigation.goBack()} />
          <H1Text>{i18n.t("account_label.change_password")}</H1Text>
          <H1Text>{i18n.t("account_check.insert_current_password")}</H1Text>
        </>
      }
      body={
        <TextField
          label={i18n.t("account_label.current_password")}
          eventHandler={(input: string) => setState({ password: input })}
          secure={true}
        />
      }
      button={
        <SubmitButton
          title={i18n.t("account_label.continue")}
          handler={() =>
            navigation.navigate(AccountPage.ResetPassword, {
              currentPassword: state.password,
            })
          }
        />
      }
    />
  );
};

export default CurrentPassword;

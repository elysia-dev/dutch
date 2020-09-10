import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { KycStatus } from "../../enums/status";
import Api from "../../api/account";
import { BackButton } from "../../shared/components/BackButton";
import { AccountPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-weight: bold;
  font-size: 20px;
  text-align: left;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 5px;
`;
const LabelText = styled.Text`
  color: #a7a7a7;
  font-size: 13px;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 5px;
`;
const ButtonText = styled.Text`
  color: #5c5b5b;
  font-size: 13px;
  text-align: center;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  email: string;
  kyc: KycStatus;
  gender: string;
  firstName: string;
  lastName: string;
}

export class MyPage extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      email: "",
      kyc: KycStatus.NONE,
      gender: "",
      firstName: "",
      lastName: "",
    };
  }

  async componentDidMount() {
    const { route, navigation } = this.props;

    Api.me()
      .then((res) => {
        this.setState({
          email: res.data.email,
          kyc: res.data.kycStatus,
          gender: res.data.gender,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          alert(i18n.t("checking_account.need_login"));
          navigation.navigate("Account");
        }
      });
  }

  render() {
    const { route, navigation } = this.props;
    return (
      <SafeAreaView
        style={{
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <BackButton
          handler={() => {
            navigation.goBack();
          }}
        />
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            paddingBottom: 0,
            height: 80,
          }}
        >
          <H1Text>{i18n.t("info_label.my_account")}</H1Text>
          <TouchableOpacity
            onPress={() => {
              Api.logout;
              navigation.navigate("Account", {
                screen: AccountPage.InitializeEmail,
              });
            }}
            style={{
              backgroundColor: "#E6ECF2",
              borderRadius: 5,
              width: 80,
              height: 25,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <ButtonText>{i18n.t("info_label.logout")}</ButtonText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingBottom: 20,
            borderBottomWidth: 5,
            borderBottomColor: "#F6F6F8",
          }}
        >
          <LabelText>{i18n.t("account_label.account_email")}</LabelText>
          <PText>{this.state.email}</PText>
          <LabelText>{i18n.t("account_label.account_password")}</LabelText>

          <TouchableOpacity
            onPress={() => {
              Api.logout;
              navigation.navigate("Account", {
                screen: AccountPage.CurrentPassword,
              });
            }}
            style={{
              backgroundColor: "#E6ECF2",
              borderRadius: 5,
              width: 120,
              height: 25,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <ButtonText>{"비밀번호 변경(임시)"}</ButtonText>
          </TouchableOpacity>
        </View>
        {this.state.kyc === KycStatus.SUCCESS && (
          <View
            style={{
              padding: 20,
              borderBottomWidth: 5,
              borderBottomColor: "#F6F6F8",
            }}
          >
            <H1Text>{i18n.t("info_label.my_info")}</H1Text>
            <LabelText>{i18n.t("info_label.name")}</LabelText>
            <PText>{`${this.state.firstName} ${this.state.lastName}`}</PText>
            <LabelText>{i18n.t("info_label.gender")}</LabelText>
            <PText>{this.state.gender}</PText>
          </View>
        )}
        <View style={{ padding: 20 }}>
          <ButtonText>{i18n.t("info_label.signout")}</ButtonText>
        </View>
      </SafeAreaView>
    );
  }
}
